module.exports = {
    coverageDirectory: "build/test-coverage",
    transform: {
        "^.+\\.(t|j)sx?$": "ts-jest",
    },
    testRegex: "\\.test\\.(t|j)sx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
