//code by shantanav mukherjee written on 30/09/2026

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const userFields = {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    mobile: { type: "string", required: true },
    address: { type: "string", required: true },
    businessName: { type: "string", required: false },
    isVerified: {type: "boolean",required:true, default: false}
};

const normalizeIndianMobile = (mobile) => {
    if (typeof mobile !== "string") return null;
    const digits = mobile.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) {
        return digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith("0")) {
        return digits.slice(1);
    }
    if (digits.length === 10) {
        return digits;
    }
    return null;
};

const validateUser = (data = {}) => {
    const errors = [];

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const address = typeof data.address === "string" ? data.address.trim() : "";
    const businessName =
        typeof data.businessName === "string" ? data.businessName.trim() : "";
    const mobile = normalizeIndianMobile(data.mobile);

    if (!name) errors.push("Name is required");
    if (!address) errors.push("Address is required");
    if (!mobile || !INDIAN_MOBILE_REGEX.test(mobile)) {
        errors.push("Mobile number must be a valid Indian 10-digit number (+91)");
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: {
            name,
            mobile,
            countryCode: "+91",
            address,
            businessName: businessName || null,
        },
    };
};

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    mobile VARCHAR(10) UNIQUE,
    country_code VARCHAR(5) DEFAULT '+91',
    address TEXT,
    business_name VARCHAR(150),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const alterUsersTableSQL = `
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
`;

module.exports = {
    userFields,
    INDIAN_MOBILE_REGEX,
    normalizeIndianMobile,
    validateUser,
    createUsersTableSQL,
    alterUsersTableSQL,
};
