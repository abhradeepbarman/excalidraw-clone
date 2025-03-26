import "dotenv/config";

const config = {
    PORT: process.env.PORT || 8000,
    DB_URL: process.env.DB_URL || ""
};

export default config;