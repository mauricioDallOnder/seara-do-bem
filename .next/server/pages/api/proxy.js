"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/proxy";
exports.ids = ["pages/api/proxy"];
exports.modules = {

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "(api)/./pages/api/proxy.ts":
/*!****************************!*\
  !*** ./pages/api/proxy.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n\nconst handler = async (req, res)=>{\n    const method = req.query.method; // Extract the method from the query\n    let url;\n    // The URL is the same for GET, POST, and PUT in this case\n    url = \"https://script.google.com/macros/s/AKfycbw142rSpzBE6hrMu_SdnvC-LMAcNa99h8cU3e3W1UF3aqZ4MHjSVLpOZzBihtahuZpb/exec\";\n    try {\n        // Determine the HTTP method to use based on the 'method' query parameter\n        let httpMethod;\n        switch(method){\n            case \"update\":\n                httpMethod = \"PUT\";\n                break;\n            case \"get\":\n                httpMethod = \"GET\";\n                break;\n            default:\n                httpMethod = \"POST\";\n        }\n        // Make the request to the Google Apps Script\n        console.log(`method: ${httpMethod}, url: ${url}, data: ${JSON.stringify(req.body)}`);\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0___default()({\n            method: httpMethod,\n            url,\n            data: httpMethod === \"GET\" ? null : req.body,\n            headers: {\n                \"Content-Type\": \"application/json\"\n            }\n        });\n        // Return the response from the Google Apps Script\n        res.status(200).json(response.data);\n    } catch (err) {\n        console.error(err);\n        res.status(500).json({\n            message: \"An error occurred while making the request to the Google Apps Script.\"\n        });\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvcHJveHkudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQzBCO0FBRTFCLE1BQU1DLFVBQVUsT0FBT0MsS0FBcUJDLE1BQXlCO0lBQ25FLE1BQU1DLFNBQVNGLElBQUlHLEtBQUssQ0FBQ0QsTUFBTSxFQUFZLG9DQUFvQztJQUMvRSxJQUFJRTtJQUVKLDBEQUEwRDtJQUMxREEsTUFBTTtJQUVOLElBQUk7UUFDRix5RUFBeUU7UUFDekUsSUFBSUM7UUFDSixPQUFRSDtZQUNOLEtBQUs7Z0JBQ0hHLGFBQWE7Z0JBQ2IsS0FBTTtZQUNSLEtBQUs7Z0JBQ0hBLGFBQWE7Z0JBQ2IsS0FBTTtZQUNSO2dCQUNFQSxhQUFhO1FBQ2pCO1FBRUEsNkNBQTZDO1FBQzdDQyxRQUFRQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUVGLFdBQVcsT0FBTyxFQUFFRCxJQUFJLFFBQVEsRUFBRUksS0FBS0MsU0FBUyxDQUFDVCxJQUFJVSxJQUFJLEVBQUUsQ0FBQztRQUNuRixNQUFNQyxXQUFXLE1BQU1iLDRDQUFLQSxDQUFDO1lBQzNCSSxRQUFRRztZQUNSRDtZQUNBUSxNQUFNUCxlQUFlLFFBQVEsSUFBSSxHQUFHTCxJQUFJVSxJQUFJO1lBQzVDRyxTQUFTO2dCQUNQLGdCQUFnQjtZQUNsQjtRQUNGO1FBRUEsa0RBQWtEO1FBQ2xEWixJQUFJYSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDSixTQUFTQyxJQUFJO0lBQ3BDLEVBQUUsT0FBT0ksS0FBSztRQUNaVixRQUFRVyxLQUFLLENBQUNEO1FBQ2RmLElBQUlhLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUcsU0FBUztRQUF3RTtJQUMxRztBQUNGO0FBRUEsaUVBQWVuQixPQUFPQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2VhcmEvLi9wYWdlcy9hcGkvcHJveHkudHM/MmQyZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmNvbnN0IGhhbmRsZXIgPSBhc3luYyAocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpID0+IHtcbiAgY29uc3QgbWV0aG9kID0gcmVxLnF1ZXJ5Lm1ldGhvZCBhcyBzdHJpbmc7IC8vIEV4dHJhY3QgdGhlIG1ldGhvZCBmcm9tIHRoZSBxdWVyeVxuICBsZXQgdXJsOiBzdHJpbmc7XG5cbiAgLy8gVGhlIFVSTCBpcyB0aGUgc2FtZSBmb3IgR0VULCBQT1NULCBhbmQgUFVUIGluIHRoaXMgY2FzZVxuICB1cmwgPSAnaHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3MTQyclNwekJFNmhyTXVfU2RudkMtTE1BY05hOTloOGNVM2UzVzFVRjNhcVo0TUhqU1ZMcE9aekJpaHRhaHVacGIvZXhlYyc7XG5cbiAgdHJ5IHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIEhUVFAgbWV0aG9kIHRvIHVzZSBiYXNlZCBvbiB0aGUgJ21ldGhvZCcgcXVlcnkgcGFyYW1ldGVyXG4gICAgbGV0IGh0dHBNZXRob2Q7XG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgIGh0dHBNZXRob2QgPSAnUFVUJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICBodHRwTWV0aG9kID0gJ0dFVCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaHR0cE1ldGhvZCA9ICdQT1NUJztcbiAgICB9XG5cbiAgICAvLyBNYWtlIHRoZSByZXF1ZXN0IHRvIHRoZSBHb29nbGUgQXBwcyBTY3JpcHRcbiAgICBjb25zb2xlLmxvZyhgbWV0aG9kOiAke2h0dHBNZXRob2R9LCB1cmw6ICR7dXJsfSwgZGF0YTogJHtKU09OLnN0cmluZ2lmeShyZXEuYm9keSl9YCk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcyh7XG4gICAgICBtZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhOiBodHRwTWV0aG9kID09PSAnR0VUJyA/IG51bGwgOiByZXEuYm9keSwgLy8gT25seSBzZW5kIGRhdGEgZm9yIG5vbi1HRVQgcmVxdWVzdHNcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFJldHVybiB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgR29vZ2xlIEFwcHMgU2NyaXB0XG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UuZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6ICdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBtYWtpbmcgdGhlIHJlcXVlc3QgdG8gdGhlIEdvb2dsZSBBcHBzIFNjcmlwdC4nIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXI7XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwicXVlcnkiLCJ1cmwiLCJodHRwTWV0aG9kIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJib2R5IiwicmVzcG9uc2UiLCJkYXRhIiwiaGVhZGVycyIsInN0YXR1cyIsImpzb24iLCJlcnIiLCJlcnJvciIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/proxy.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/proxy.ts"));
module.exports = __webpack_exports__;

})();