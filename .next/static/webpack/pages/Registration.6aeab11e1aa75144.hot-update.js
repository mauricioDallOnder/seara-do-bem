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

/***/ "./app/components/TabelaBeneficiarios/TabelaDadosInativos.tsx":
/*!********************************************************************!*\
  !*** ./app/components/TabelaBeneficiarios/TabelaDadosInativos.tsx ***!
  \********************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"TabelaInativos\": function() { return /* binding */ TabelaInativos; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app/context/DataContext */ \"./app/context/DataContext.tsx\");\n/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material */ \"./node_modules/@mui/material/Button/Button.js\");\n/* harmony import */ var jspdf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jspdf */ \"./node_modules/jspdf/dist/jspdf.es.min.js\");\n/* harmony import */ var jspdf_autotable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jspdf-autotable */ \"./node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js\");\n/* harmony import */ var jspdf_autotable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jspdf_autotable__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _s = $RefreshSig$();\n\n\n\n\nconst TabelaInativos = ()=>{\n    _s();\n    const { data  } = (0,_app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__.useData)();\n    const exportPDF = (items)=>{\n        const unit = \"pt\";\n        const size = \"A4\";\n        const orientation = \"landscape\";\n        const marginLeft = 10;\n        const doc = new jspdf__WEBPACK_IMPORTED_MODULE_2__[\"default\"](orientation, unit, size);\n        doc.setFontSize(15);\n        const filteredData = items.filter((item)=>Object.values(item).some((value)=>typeof value === \"string\" && value.includes(\"DESLIGADO\"))).map((elt, index)=>[\n                index + 1,\n                elt.nome_beneficiario || \"\",\n                elt.data_ingresso || \"\",\n                elt.telefone || \"\",\n                elt.rua || \"\",\n                elt.numero || \"\",\n                elt.bairro || \"\",\n                elt.Observações || \"\",\n                elt.faltas || \"\"\n            ]);\n        doc.text(\"Tabela de beneficiarios Inativos\", marginLeft, 30);\n        jspdf_autotable__WEBPACK_IMPORTED_MODULE_3___default()(doc, {\n            head: [\n                [\n                    \"N\",\n                    \"NOME\",\n                    \"DATA DE INGRESSO\",\n                    \"TELEFONE\",\n                    \"RUA\",\n                    \"NUMERO\",\n                    \"BAIRRO\",\n                    \"OBSERVA\\xc7\\xd5ES\"\n                ]\n            ],\n            body: filteredData,\n            bodyStyles: {\n                valign: \"middle\",\n                halign: \"center\",\n                cellWidth: \"wrap\"\n            },\n            columnStyles: {\n                0: {\n                    cellWidth: 20\n                },\n                1: {\n                    cellWidth: 130\n                },\n                2: {\n                    cellWidth: 70\n                },\n                3: {\n                    cellWidth: 70\n                },\n                4: {\n                    cellWidth: 130\n                },\n                5: {\n                    cellWidth: 70\n                }\n            },\n            styles: {\n                cellPadding: {\n                    top: 2,\n                    right: 2,\n                    bottom: 2,\n                    left: 2\n                },\n                lineColor: [\n                    44,\n                    62,\n                    80\n                ],\n                lineWidth: 0.75\n            }\n        });\n        doc.save(\"tabela de inativos.pdf\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        variant: \"contained\",\n        color: \"error\",\n        size: \"small\",\n        onClick: ()=>exportPDF(data),\n        children: \"Tabela de desligados do programa\"\n    }, void 0, false, {\n        fileName: \"/Users/mauri/Desktop/projetos/app ceab/ceab-teste/app/components/TabelaBeneficiarios/TabelaDadosInativos.tsx\",\n        lineNumber: 79,\n        columnNumber: 5\n    }, undefined);\n};\n_s(TabelaInativos, \"48GbdIYpj5SXn0fqwnlSFa/Jh0k=\", false, function() {\n    return [\n        _app_context_DataContext__WEBPACK_IMPORTED_MODULE_1__.useData\n    ];\n});\n_c = TabelaInativos;\nvar _c;\n$RefreshReg$(_c, \"TabelaInativos\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvY29tcG9uZW50cy9UYWJlbGFCZW5lZmljaWFyaW9zL1RhYmVsYURhZG9zSW5hdGl2b3MudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFpRTtBQUMxQjtBQUNiO0FBQ2M7QUFFakMsTUFBTUksaUJBQWlCLElBQU07O0lBQ2xDLE1BQU0sRUFBRUMsS0FBSSxFQUFFLEdBQUdMLGlFQUFPQTtJQUV4QixNQUFNTSxZQUFZLENBQUNDLFFBQXlCO1FBQzFDLE1BQU1DLE9BQU87UUFDYixNQUFNQyxPQUFPO1FBQ2IsTUFBTUMsY0FBYztRQUVwQixNQUFNQyxhQUFhO1FBQ25CLE1BQU1DLE1BQU0sSUFBSVYsNkNBQUtBLENBQUNRLGFBQWFGLE1BQU1DO1FBRXpDRyxJQUFJQyxXQUFXLENBQUM7UUFFaEIsTUFBTUMsZUFBZVAsTUFDbEJRLE1BQU0sQ0FBQyxDQUFDQyxPQUNQQyxPQUFPQyxNQUFNLENBQUNGLE1BQU1HLElBQUksQ0FBQ0MsQ0FBQUEsUUFDdkIsT0FBT0EsVUFBVSxZQUFZQSxNQUFNQyxRQUFRLENBQUMsZUFHL0NDLEdBQUcsQ0FBQyxDQUFDQyxLQUFLQyxRQUFVO2dCQUNuQkEsUUFBUTtnQkFDUkQsSUFBSUUsaUJBQWlCLElBQUk7Z0JBQ3pCRixJQUFJRyxhQUFhLElBQUk7Z0JBQ3JCSCxJQUFJSSxRQUFRLElBQUk7Z0JBQ2hCSixJQUFJSyxHQUFHLElBQUk7Z0JBQ1hMLElBQUlNLE1BQU0sSUFBSTtnQkFDZE4sSUFBSU8sTUFBTSxJQUFJO2dCQUNkUCxJQUFJUSxXQUFXLElBQUk7Z0JBQ25CUixJQUFJUyxNQUFNLElBQUk7YUFDZjtRQUVIcEIsSUFBSXFCLElBQUksQ0FBQyxvQ0FBb0N0QixZQUFZO1FBRXpEUixzREFBU0EsQ0FBQ1MsS0FBSztZQUNic0IsTUFBTTtnQkFDSjtvQkFDRTtvQkFDQTtvQkFDQTtvQkFDQTtvQkFDQTtvQkFDQTtvQkFDQTtvQkFDQTtpQkFFRDthQUNGO1lBQ0RDLE1BQU1yQjtZQUVOc0IsWUFBWTtnQkFDVkMsUUFBUTtnQkFDUkMsUUFBUTtnQkFDUkMsV0FBVztZQUNiO1lBQ0FDLGNBQWM7Z0JBQ1osR0FBRztvQkFBRUQsV0FBVztnQkFBRztnQkFDbkIsR0FBRztvQkFBRUEsV0FBVztnQkFBSTtnQkFDcEIsR0FBRztvQkFBRUEsV0FBVztnQkFBRztnQkFDbkIsR0FBRztvQkFBRUEsV0FBVztnQkFBRztnQkFDbkIsR0FBRztvQkFBRUEsV0FBVztnQkFBSTtnQkFDcEIsR0FBRztvQkFBRUEsV0FBVztnQkFBRztZQUNyQjtZQUVBRSxRQUFRO2dCQUNOQyxhQUFhO29CQUFFQyxLQUFLO29CQUFHQyxPQUFPO29CQUFHQyxRQUFRO29CQUFHQyxNQUFNO2dCQUFFO2dCQUNwREMsV0FBVztvQkFBQztvQkFBSTtvQkFBSTtpQkFBRztnQkFDdkJDLFdBQVc7WUFDYjtRQUNGO1FBQ0FwQyxJQUFJcUMsSUFBSSxDQUFDO0lBQ1g7SUFFQSxxQkFDRSw4REFBQ2hELHFEQUFNQTtRQUNMaUQsU0FBUTtRQUNSQyxPQUFNO1FBQ04xQyxNQUFLO1FBQ0wyQyxTQUFTLElBQU05QyxVQUFVRDtrQkFDMUI7Ozs7OztBQUlMLEVBQUU7R0FsRldEOztRQUNNSiw2REFBT0E7OztLQURiSSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9hcHAvY29tcG9uZW50cy9UYWJlbGFCZW5lZmljaWFyaW9zL1RhYmVsYURhZG9zSW5hdGl2b3MudHN4PzE2ODMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRGF0YSwgSW5wdXRzUHJvcHMgfSBmcm9tIFwiQC9hcHAvY29udGV4dC9EYXRhQ29udGV4dFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcbmltcG9ydCBqc1BERiBmcm9tIFwianNwZGZcIjtcbmltcG9ydCBhdXRvVGFibGUgZnJvbSBcImpzcGRmLWF1dG90YWJsZVwiO1xuXG5leHBvcnQgY29uc3QgVGFiZWxhSW5hdGl2b3MgPSAoKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gdXNlRGF0YSgpO1xuXG4gIGNvbnN0IGV4cG9ydFBERiA9IChpdGVtczogSW5wdXRzUHJvcHNbXSkgPT4ge1xuICAgIGNvbnN0IHVuaXQgPSBcInB0XCI7XG4gICAgY29uc3Qgc2l6ZSA9IFwiQTRcIjtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IFwibGFuZHNjYXBlXCI7XG5cbiAgICBjb25zdCBtYXJnaW5MZWZ0ID0gMTA7XG4gICAgY29uc3QgZG9jID0gbmV3IGpzUERGKG9yaWVudGF0aW9uLCB1bml0LCBzaXplKTtcblxuICAgIGRvYy5zZXRGb250U2l6ZSgxNSk7XG5cbiAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSBpdGVtc1xuICAgICAgLmZpbHRlcigoaXRlbSkgPT5cbiAgICAgICAgT2JqZWN0LnZhbHVlcyhpdGVtKS5zb21lKHZhbHVlID0+XG4gICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlLmluY2x1ZGVzKFwiREVTTElHQURPXCIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5tYXAoKGVsdCwgaW5kZXgpID0+IFsgLy8gQWRpY2lvbmFuZG8gbyBpbmRleCBwYXJhIGEgY29sdW5hIE9yZGVtXG4gICAgICAgIGluZGV4ICsgMSxcbiAgICAgICAgZWx0Lm5vbWVfYmVuZWZpY2lhcmlvIHx8IFwiXCIsXG4gICAgICAgIGVsdC5kYXRhX2luZ3Jlc3NvIHx8IFwiXCIsXG4gICAgICAgIGVsdC50ZWxlZm9uZSB8fCBcIlwiLFxuICAgICAgICBlbHQucnVhIHx8IFwiXCIsXG4gICAgICAgIGVsdC5udW1lcm8gfHwgXCJcIixcbiAgICAgICAgZWx0LmJhaXJybyB8fCBcIlwiLFxuICAgICAgICBlbHQuT2JzZXJ2YcOnw7VlcyB8fCBcIlwiLFxuICAgICAgICBlbHQuZmFsdGFzIHx8IFwiXCIsXG4gICAgICBdKTtcblxuICAgIGRvYy50ZXh0KFwiVGFiZWxhIGRlIGJlbmVmaWNpYXJpb3MgSW5hdGl2b3NcIiwgbWFyZ2luTGVmdCwgMzApO1xuXG4gICAgYXV0b1RhYmxlKGRvYywge1xuICAgICAgaGVhZDogW1xuICAgICAgICBbXG4gICAgICAgICAgXCJOXCIsXG4gICAgICAgICAgXCJOT01FXCIsXG4gICAgICAgICAgXCJEQVRBIERFIElOR1JFU1NPXCIsXG4gICAgICAgICAgXCJURUxFRk9ORVwiLFxuICAgICAgICAgIFwiUlVBXCIsXG4gICAgICAgICAgXCJOVU1FUk9cIixcbiAgICAgICAgICBcIkJBSVJST1wiLFxuICAgICAgICAgIFwiT0JTRVJWQcOHw5VFU1wiLFxuICAgICAgICAgIFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICAgIGJvZHk6IGZpbHRlcmVkRGF0YSxcblxuICAgICAgYm9keVN0eWxlczoge1xuICAgICAgICB2YWxpZ246IFwibWlkZGxlXCIsXG4gICAgICAgIGhhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgY2VsbFdpZHRoOiBcIndyYXBcIixcbiAgICAgIH0sXG4gICAgICBjb2x1bW5TdHlsZXM6IHtcbiAgICAgICAgMDogeyBjZWxsV2lkdGg6IDIwIH0sXG4gICAgICAgIDE6IHsgY2VsbFdpZHRoOiAxMzAgfSxcbiAgICAgICAgMjogeyBjZWxsV2lkdGg6IDcwIH0sXG4gICAgICAgIDM6IHsgY2VsbFdpZHRoOiA3MCB9LFxuICAgICAgICA0OiB7IGNlbGxXaWR0aDogMTMwIH0sXG4gICAgICAgIDU6IHsgY2VsbFdpZHRoOiA3MCB9LFxuICAgICAgfSxcblxuICAgICAgc3R5bGVzOiB7XG4gICAgICAgIGNlbGxQYWRkaW5nOiB7IHRvcDogMiwgcmlnaHQ6IDIsIGJvdHRvbTogMiwgbGVmdDogMiB9LFxuICAgICAgICBsaW5lQ29sb3I6IFs0NCwgNjIsIDgwXSxcbiAgICAgICAgbGluZVdpZHRoOiAwLjc1LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBkb2Muc2F2ZShcInRhYmVsYSBkZSBpbmF0aXZvcy5wZGZcIik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8QnV0dG9uXG4gICAgICB2YXJpYW50PVwiY29udGFpbmVkXCJcbiAgICAgIGNvbG9yPVwiZXJyb3JcIlxuICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgIG9uQ2xpY2s9eygpID0+IGV4cG9ydFBERihkYXRhKX1cbiAgICA+XG4gICAgIFRhYmVsYSBkZSBkZXNsaWdhZG9zIGRvIHByb2dyYW1hXG4gICAgPC9CdXR0b24+XG4gICk7XG59O1xuIl0sIm5hbWVzIjpbInVzZURhdGEiLCJCdXR0b24iLCJqc1BERiIsImF1dG9UYWJsZSIsIlRhYmVsYUluYXRpdm9zIiwiZGF0YSIsImV4cG9ydFBERiIsIml0ZW1zIiwidW5pdCIsInNpemUiLCJvcmllbnRhdGlvbiIsIm1hcmdpbkxlZnQiLCJkb2MiLCJzZXRGb250U2l6ZSIsImZpbHRlcmVkRGF0YSIsImZpbHRlciIsIml0ZW0iLCJPYmplY3QiLCJ2YWx1ZXMiLCJzb21lIiwidmFsdWUiLCJpbmNsdWRlcyIsIm1hcCIsImVsdCIsImluZGV4Iiwibm9tZV9iZW5lZmljaWFyaW8iLCJkYXRhX2luZ3Jlc3NvIiwidGVsZWZvbmUiLCJydWEiLCJudW1lcm8iLCJiYWlycm8iLCJPYnNlcnZhw6fDtWVzIiwiZmFsdGFzIiwidGV4dCIsImhlYWQiLCJib2R5IiwiYm9keVN0eWxlcyIsInZhbGlnbiIsImhhbGlnbiIsImNlbGxXaWR0aCIsImNvbHVtblN0eWxlcyIsInN0eWxlcyIsImNlbGxQYWRkaW5nIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwibGluZUNvbG9yIiwibGluZVdpZHRoIiwic2F2ZSIsInZhcmlhbnQiLCJjb2xvciIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/components/TabelaBeneficiarios/TabelaDadosInativos.tsx\n"));

/***/ })

});