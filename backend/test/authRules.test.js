const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
    generateOtp,
    hashOtp,
    isSixDigitOtp,
    createOtpPayload,
    evaluateOtpPresence,
    evaluateOtpAttempt,
    evaluateLogin,
    OTP_MIN,
    OTP_MAX,
    MAX_ATTEMPTS,
} = require("../src/service/authRules");

describe("OTP generation", () => {
    it("generates a 6-digit numeric string", () => {
        for (let i = 0; i < 50; i += 1) {
            const otp = generateOtp();
            assert.equal(isSixDigitOtp(otp), true);
            const value = Number(otp);
            assert.ok(value >= OTP_MIN);
            assert.ok(value < OTP_MAX);
        }
    });

    it("hashes OTPs deterministically and hides the raw value", () => {
        const otp = "123456";
        const hashed = hashOtp(otp);
        assert.equal(hashed, hashOtp(otp));
        assert.notEqual(hashed, otp);
        assert.equal(hashed.length, 64);
    });
});

describe("OTP expiry", () => {
    it("treats missing redis payload as expired", () => {
        const result = evaluateOtpPresence(null);
        assert.deepEqual(result, {
            ok: false,
            message: "OTP expired or not found",
        });
    });

    it("allows verification when payload is present", () => {
        assert.equal(evaluateOtpPresence(JSON.stringify(createOtpPayload("111111"))), null);
    });
});

describe("OTP attempt limits", () => {
    it("accepts the correct OTP and clears the challenge", () => {
        const payload = createOtpPayload("654321");
        const result = evaluateOtpAttempt(payload, "654321");
        assert.equal(result.ok, true);
        assert.equal(result.clear, true);
        assert.equal(result.message, "OTP verified successfully");
    });

    it("increments attempts on wrong OTP", () => {
        const payload = createOtpPayload("654321");
        const result = evaluateOtpAttempt(payload, "000000");
        assert.equal(result.ok, false);
        assert.equal(result.message, "Invalid OTP");
        assert.equal(result.payload.attempts, 1);
        assert.equal(result.clear, false);
    });

    it("warns on the final allowed attempt", () => {
        const payload = { ...createOtpPayload("654321"), attempts: MAX_ATTEMPTS - 1 };
        const result = evaluateOtpAttempt(payload, "000000");
        assert.equal(result.ok, false);
        assert.equal(result.message, "This is your last attempt");
        assert.equal(result.payload.attempts, MAX_ATTEMPTS);
        assert.equal(result.clear, false);
    });

    it("locks out after exceeding max attempts", () => {
        const payload = { ...createOtpPayload("654321"), attempts: MAX_ATTEMPTS };
        const result = evaluateOtpAttempt(payload, "000000");
        assert.equal(result.ok, false);
        assert.equal(result.message, "Too many attempts, please try again later");
        assert.equal(result.clear, true);
    });
});

describe("Login rules", () => {
    it("rejects unknown users", () => {
        const result = evaluateLogin({ user: null, isPasswordValid: false });
        assert.deepEqual(result, {
            ok: false,
            error: "Invalid credentials",
            needsVerification: false,
        });
    });

    it("rejects invalid passwords", () => {
        const result = evaluateLogin({
            user: { id: 1, email: "a@b.com", is_verified: true },
            isPasswordValid: false,
        });
        assert.equal(result.ok, false);
        assert.equal(result.error, "Invalid credentials");
    });

    it("requires email verification before issuing a session", () => {
        const result = evaluateLogin({
            user: { id: 1, email: "a@b.com", is_verified: false },
            isPasswordValid: true,
        });
        assert.equal(result.ok, false);
        assert.equal(result.needsVerification, true);
        assert.match(result.message, /verify/i);
    });

    it("allows verified users with valid passwords", () => {
        const user = { id: 1, email: "a@b.com", is_verified: true };
        const result = evaluateLogin({ user, isPasswordValid: true });
        assert.equal(result.ok, true);
        assert.equal(result.user, user);
    });
});
