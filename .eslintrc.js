module.exports = {
    parser: "@typescript-eslint/parser", // TypeScript 파서를 사용
    parserOptions: {
        ecmaVersion: 2020, // 최신 ECMAScript 기능 지원
        sourceType: "module", // ES 모듈 지원
        ecmaFeatures: {
            jsx: true, // JSX 지원
        },
    },
    settings: {
        react: {
            version: "detect", // React 버전 자동 감지
        },
    },
    rules: {
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "off",
    },
};
