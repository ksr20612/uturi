"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@zag-js+types@1.21.7";
exports.ids = ["vendor-chunks/@zag-js+types@1.21.7"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@zag-js+types@1.21.7/node_modules/@zag-js/types/dist/index.mjs":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@zag-js+types@1.21.7/node_modules/@zag-js/types/dist/index.mjs ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createNormalizer: () => (/* binding */ createNormalizer),\n/* harmony export */   createProps: () => (/* binding */ createProps)\n/* harmony export */ });\n// src/prop-types.ts\nfunction createNormalizer(fn) {\n  return new Proxy({}, {\n    get(_target, key) {\n      if (key === \"style\")\n        return (props) => {\n          return fn({ style: props }).style;\n        };\n      return fn;\n    }\n  });\n}\n\n// src/create-props.ts\nvar createProps = () => (props) => Array.from(new Set(props));\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B6YWctanMrdHlwZXNAMS4yMS43L25vZGVfbW9kdWxlcy9AemFnLWpzL3R5cGVzL2Rpc3QvaW5kZXgubWpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsY0FBYztBQUNwQztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFeUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AdXR1cmkvdXR1cmkvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B6YWctanMrdHlwZXNAMS4yMS43L25vZGVfbW9kdWxlcy9AemFnLWpzL3R5cGVzL2Rpc3QvaW5kZXgubWpzPzJmZGEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL3Byb3AtdHlwZXMudHNcbmZ1bmN0aW9uIGNyZWF0ZU5vcm1hbGl6ZXIoZm4pIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh7fSwge1xuICAgIGdldChfdGFyZ2V0LCBrZXkpIHtcbiAgICAgIGlmIChrZXkgPT09IFwic3R5bGVcIilcbiAgICAgICAgcmV0dXJuIChwcm9wcykgPT4ge1xuICAgICAgICAgIHJldHVybiBmbih7IHN0eWxlOiBwcm9wcyB9KS5zdHlsZTtcbiAgICAgICAgfTtcbiAgICAgIHJldHVybiBmbjtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBzcmMvY3JlYXRlLXByb3BzLnRzXG52YXIgY3JlYXRlUHJvcHMgPSAoKSA9PiAocHJvcHMpID0+IEFycmF5LmZyb20obmV3IFNldChwcm9wcykpO1xuXG5leHBvcnQgeyBjcmVhdGVOb3JtYWxpemVyLCBjcmVhdGVQcm9wcyB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@zag-js+types@1.21.7/node_modules/@zag-js/types/dist/index.mjs\n");

/***/ })

};
;