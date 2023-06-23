"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/Registration",{

/***/ "./app/components/TabelaBeneficiarios/TabelaDados.tsx":
/*!************************************************************!*\
  !*** ./app/components/TabelaBeneficiarios/TabelaDados.tsx ***!
  \************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"TabelaDados\": function() { return /* binding */ TabelaDados; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app/context/DataContext */ \"./app/context/DataContext.tsx\");\n/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material */ \"./node_modules/@mui/material/Button/Button.js\");\n/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jspdf */ \"./node_modules/jspdf/dist/jspdf.es.min.js\");\n/* harmony import */ var jspdf_autotable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jspdf-autotable */ \"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js\");\n/* harmony import */ var jspdf_autotable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jspdf_autotable__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _s = $RefreshSig$();\n\n\n\n\nconst TabelaDados = ()=>{\n    _s();\n    const { data  } = (0,_app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__.useData)();\n    const exportPDF = (items)=>{\n        const unit = \"pt\";\n        const size = \"A4\";\n        const orientation = \"landscape\";\n        const marginLeft = 10;\n        const doc = new jspdf__WEBPACK_IMPORTED_MODULE_2__[\"default\"](orientation, unit, size);\n        doc.setFontSize(15);\n        const filteredData = items.filter((item)=>!Object.values(item).some((value)=>typeof value === \"string\" && value.includes(\"DESLIGADO\"))).map((elt, index)=>[\n                index + 1,\n                elt.nome_beneficiario || \"\",\n                elt.data_ingresso || \"\",\n                elt.telefone || \"\",\n                elt.rua || \"\",\n                elt.numero || \"\",\n                elt.bairro || \"\",\n                elt.Observações || \"\"\n            ]);\n        doc.text(\"Tabela de beneficiarios Seara do Bem(ativos no programa)\", marginLeft, 30);\n        jspdf_autotable__WEBPACK_IMPORTED_MODULE_3___default()(doc, {\n            head: [\n                [\n                    \"ORDEM\",\n                    \"NOME\",\n                    \"DATA DE INGRESSO\",\n                    \"TELEFONE\",\n                    \"RUA\",\n                    \"NUMERO\",\n                    \"BAIRRO\",\n                    \"OBS\"\n                ]\n            ],\n            body: filteredData,\n            bodyStyles: {\n                valign: \"middle\",\n                halign: \"center\",\n                cellWidth: \"wrap\"\n            },\n            columnStyles: {\n                0: {\n                    cellWidth: 20\n                },\n                1: {\n                    cellWidth: 130\n                },\n                2: {\n                    cellWidth: 50\n                },\n                3: {\n                    cellWidth: 70\n                },\n                4: {\n                    cellWidth: 130\n                },\n                5: {\n                    cellWidth: 70\n                }\n            },\n            styles: {\n                cellPadding: {\n                    top: 2,\n                    right: 2,\n                    bottom: 2,\n                    left: 2\n                },\n                lineColor: [\n                    44,\n                    62,\n                    80\n                ],\n                lineWidth: 0.75\n            }\n        });\n        doc.save(\"tabela de beneficiarios ativos.pdf\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        variant: \"contained\",\n        color: \"success\",\n        size: \"small\",\n        onClick: ()=>exportPDF(data),\n        children: \"Tabela de ativos do programa\"\n    }, void 0, false, {\n        fileName: \"/Users/mauri/Desktop/projetos/app ceab/ceab-teste/app/components/TabelaBeneficiarios/TabelaDados.tsx\",\n        lineNumber: 79,\n        columnNumber: 5\n    }, undefined);\n};\n_s(TabelaDados, \"48GbdIYpj5SXn0fqwnlSFa/Jh0k=\", false, function() {\n    return [\n        _app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__.useData\n    ];\n});\n_c = TabelaDados;\nvar _c;\n$RefreshReg$(_c, \"TabelaDados\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvY29tcG9uZW50cy9UYWJlbGFCZW5lZmljaWFyaW9zL1RhYmVsYURhZG9zLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBaUU7QUFDMUI7QUFDYjtBQUNjO0FBRWpDLE1BQU1JLGNBQWMsSUFBTTs7SUFDL0IsTUFBTSxFQUFFQyxLQUFJLEVBQUUsR0FBR0wsaUVBQU9BO0lBRXhCLE1BQU1NLFlBQVksQ0FBQ0MsUUFBeUI7UUFDMUMsTUFBTUMsT0FBTztRQUNiLE1BQU1DLE9BQU87UUFDYixNQUFNQyxjQUFjO1FBRXBCLE1BQU1DLGFBQWE7UUFDbkIsTUFBTUMsTUFBTSxJQUFJViw2Q0FBS0EsQ0FBQ1EsYUFBYUYsTUFBTUM7UUFFekNHLElBQUlDLFdBQVcsQ0FBQztRQUVoQixNQUFNQyxlQUFlUCxNQUNsQlEsTUFBTSxDQUFDLENBQUNDLE9BQ1AsQ0FBQ0MsT0FBT0MsTUFBTSxDQUFDRixNQUFNRyxJQUFJLENBQUNDLENBQUFBLFFBQ3hCLE9BQU9BLFVBQVUsWUFBWUEsTUFBTUMsUUFBUSxDQUFDLGVBRy9DQyxHQUFHLENBQUMsQ0FBQ0MsS0FBS0MsUUFBVTtnQkFDbkJBLFFBQVE7Z0JBQ1JELElBQUlFLGlCQUFpQixJQUFJO2dCQUN6QkYsSUFBSUcsYUFBYSxJQUFJO2dCQUNyQkgsSUFBSUksUUFBUSxJQUFJO2dCQUNoQkosSUFBSUssR0FBRyxJQUFJO2dCQUNYTCxJQUFJTSxNQUFNLElBQUk7Z0JBQ2ROLElBQUlPLE1BQU0sSUFBSTtnQkFDZFAsSUFBSVEsV0FBVyxJQUFJO2FBQ3BCO1FBRUhuQixJQUFJb0IsSUFBSSxDQUFDLDREQUE0RHJCLFlBQVk7UUFFakZSLHNEQUFTQSxDQUFDUyxLQUFLO1lBQ2JxQixNQUFNO2dCQUNKO29CQUNFO29CQUNBO29CQUNBO29CQUNBO29CQUNBO29CQUNBO29CQUNBO29CQUNBO2lCQUVEO2FBQ0Y7WUFDREMsTUFBTXBCO1lBRU5xQixZQUFZO2dCQUNWQyxRQUFRO2dCQUNSQyxRQUFRO2dCQUNSQyxXQUFXO1lBQ2I7WUFDQUMsY0FBYztnQkFDWixHQUFHO29CQUFFRCxXQUFXO2dCQUFHO2dCQUNuQixHQUFHO29CQUFFQSxXQUFXO2dCQUFJO2dCQUNwQixHQUFHO29CQUFFQSxXQUFXO2dCQUFHO2dCQUNuQixHQUFHO29CQUFFQSxXQUFXO2dCQUFHO2dCQUNuQixHQUFHO29CQUFFQSxXQUFXO2dCQUFJO2dCQUNwQixHQUFHO29CQUFFQSxXQUFXO2dCQUFHO1lBRXJCO1lBRUFFLFFBQVE7Z0JBQ05DLGFBQWE7b0JBQUVDLEtBQUs7b0JBQUdDLE9BQU87b0JBQUdDLFFBQVE7b0JBQUdDLE1BQU07Z0JBQUU7Z0JBQ3BEQyxXQUFXO29CQUFDO29CQUFJO29CQUFJO2lCQUFHO2dCQUN2QkMsV0FBVztZQUNiO1FBQ0Y7UUFDQW5DLElBQUlvQyxJQUFJLENBQUM7SUFDWDtJQUVBLHFCQUNFLDhEQUFDL0MscURBQU1BO1FBQ0xnRCxTQUFRO1FBQ1JDLE9BQU07UUFDTnpDLE1BQUs7UUFDTDBDLFNBQVMsSUFBTTdDLFVBQVVEO2tCQUMxQjs7Ozs7O0FBSUwsRUFBRTtHQWxGV0Q7O1FBQ01KLDZEQUFPQTs7O0tBRGJJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2FwcC9jb21wb25lbnRzL1RhYmVsYUJlbmVmaWNpYXJpb3MvVGFiZWxhRGFkb3MudHN4P2VlODgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRGF0YSwgSW5wdXRzUHJvcHMgfSBmcm9tIFwiQC9hcHAvY29udGV4dC9EYXRhQ29udGV4dFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcbmltcG9ydCBqc1BERiBmcm9tIFwianNwZGZcIjtcbmltcG9ydCBhdXRvVGFibGUgZnJvbSBcImpzcGRmLWF1dG90YWJsZVwiO1xuXG5leHBvcnQgY29uc3QgVGFiZWxhRGFkb3MgPSAoKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gdXNlRGF0YSgpO1xuXG4gIGNvbnN0IGV4cG9ydFBERiA9IChpdGVtczogSW5wdXRzUHJvcHNbXSkgPT4ge1xuICAgIGNvbnN0IHVuaXQgPSBcInB0XCI7XG4gICAgY29uc3Qgc2l6ZSA9IFwiQTRcIjtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IFwibGFuZHNjYXBlXCI7XG5cbiAgICBjb25zdCBtYXJnaW5MZWZ0ID0gMTA7XG4gICAgY29uc3QgZG9jID0gbmV3IGpzUERGKG9yaWVudGF0aW9uLCB1bml0LCBzaXplKTtcblxuICAgIGRvYy5zZXRGb250U2l6ZSgxNSk7XG5cbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBpdGVtc1xuICAgICAgLmZpbHRlcigoaXRlbSkgPT5cbiAgICAgICAgIU9iamVjdC52YWx1ZXMoaXRlbSkuc29tZSh2YWx1ZSA9PlxuICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5pbmNsdWRlcyhcIkRFU0xJR0FET1wiKVxuICAgICAgICApXG4gICAgICApXG4gICAgICAubWFwKChlbHQsIGluZGV4KSA9PiBbIC8vIEFkaWNpb25hbmRvIG8gaW5kZXggcGFyYSBhIGNvbHVuYSBPcmRlbVxuICAgICAgICBpbmRleCArIDEsXG4gICAgICAgIGVsdC5ub21lX2JlbmVmaWNpYXJpbyB8fCBcIlwiLFxuICAgICAgICBlbHQuZGF0YV9pbmdyZXNzbyB8fCBcIlwiLFxuICAgICAgICBlbHQudGVsZWZvbmUgfHwgXCJcIixcbiAgICAgICAgZWx0LnJ1YSB8fCBcIlwiLFxuICAgICAgICBlbHQubnVtZXJvIHx8IFwiXCIsXG4gICAgICAgIGVsdC5iYWlycm8gfHwgXCJcIixcbiAgICAgICAgZWx0Lk9ic2VydmHDp8O1ZXMgfHwgXCJcIixcbiAgICAgIF0pO1xuXG4gICAgZG9jLnRleHQoXCJUYWJlbGEgZGUgYmVuZWZpY2lhcmlvcyBTZWFyYSBkbyBCZW0oYXRpdm9zIG5vIHByb2dyYW1hKVwiLCBtYXJnaW5MZWZ0LCAzMCk7XG5cbiAgICBhdXRvVGFibGUoZG9jLCB7XG4gICAgICBoZWFkOiBbXG4gICAgICAgIFtcbiAgICAgICAgICBcIk9SREVNXCIsXG4gICAgICAgICAgXCJOT01FXCIsXG4gICAgICAgICAgXCJEQVRBIERFIElOR1JFU1NPXCIsXG4gICAgICAgICAgXCJURUxFRk9ORVwiLFxuICAgICAgICAgIFwiUlVBXCIsXG4gICAgICAgICAgXCJOVU1FUk9cIixcbiAgICAgICAgICBcIkJBSVJST1wiLFxuICAgICAgICAgIFwiT0JTXCIsXG4gICAgICAgIFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICAgIGJvZHk6IGZpbHRlcmVkRGF0YSxcblxuICAgICAgYm9keVN0eWxlczoge1xuICAgICAgICB2YWxpZ246IFwibWlkZGxlXCIsXG4gICAgICAgIGhhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgY2VsbFdpZHRoOiBcIndyYXBcIixcbiAgICAgIH0sXG4gICAgICBjb2x1bW5TdHlsZXM6IHtcbiAgICAgICAgMDogeyBjZWxsV2lkdGg6IDIwIH0sXG4gICAgICAgIDE6IHsgY2VsbFdpZHRoOiAxMzAgfSxcbiAgICAgICAgMjogeyBjZWxsV2lkdGg6IDUwIH0sXG4gICAgICAgIDM6IHsgY2VsbFdpZHRoOiA3MCB9LFxuICAgICAgICA0OiB7IGNlbGxXaWR0aDogMTMwIH0sXG4gICAgICAgIDU6IHsgY2VsbFdpZHRoOiA3MCB9LFxuICAgICAgICBcbiAgICAgIH0sXG5cbiAgICAgIHN0eWxlczoge1xuICAgICAgICBjZWxsUGFkZGluZzogeyB0b3A6IDIsIHJpZ2h0OiAyLCBib3R0b206IDIsIGxlZnQ6IDIgfSxcbiAgICAgICAgbGluZUNvbG9yOiBbNDQsIDYyLCA4MF0sXG4gICAgICAgIGxpbmVXaWR0aDogMC43NSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZG9jLnNhdmUoXCJ0YWJlbGEgZGUgYmVuZWZpY2lhcmlvcyBhdGl2b3MucGRmXCIpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPEJ1dHRvblxuICAgICAgdmFyaWFudD1cImNvbnRhaW5lZFwiXG4gICAgICBjb2xvcj1cInN1Y2Nlc3NcIlxuICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgIG9uQ2xpY2s9eygpID0+IGV4cG9ydFBERihkYXRhKX1cbiAgICA+XG4gICAgICBUYWJlbGEgZGUgYXRpdm9zIGRvIHByb2dyYW1hXG4gICAgPC9CdXR0b24+XG4gICk7XG59O1xuIl0sIm5hbWVzIjpbInVzZURhdGEiLCJCdXR0b24iLCJqc1BERiIsImF1dG9UYWJsZSIsIlRhYmVsYURhZG9zIiwiZGF0YSIsImV4cG9ydFBERiIsIml0ZW1zIiwidW5pdCIsInNpemUiLCJvcmllbnRhdGlvbiIsIm1hcmdpbkxlZnQiLCJkb2MiLCJzZXRGb250U2l6ZSIsImZpbHRlcmVkRGF0YSIsImZpbHRlciIsIml0ZW0iLCJPYmplY3QiLCJ2YWx1ZXMiLCJzb21lIiwidmFsdWUiLCJpbmNsdWRlcyIsIm1hcCIsImVsdCIsImluZGV4Iiwibm9tZV9iZW5lZmljaWFyaW8iLCJkYXRhX2luZ3Jlc3NvIiwidGVsZWZvbmUiLCJydWEiLCJudW1lcm8iLCJiYWlycm8iLCJPYnNlcnZhw6fDtWVzIiwidGV4dCIsImhlYWQiLCJib2R5IiwiYm9keVN0eWxlcyIsInZhbGlnbiIsImhhbGlnbiIsImNlbGxXaWR0aCIsImNvbHVtblN0eWxlcyIsInN0eWxlcyIsImNlbGxQYWRkaW5nIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwibGluZUNvbG9yIiwibGluZVdpZHRoIiwic2F2ZSIsInZhcmlhbnQiLCJjb2xvciIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/components/TabelaBeneficiarios/TabelaDados.tsx\n"));

/***/ })

});