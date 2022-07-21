"use strict";
// Based on Nx run-commands executor
// https://github.com/nrwl/nx/blob/master/packages/nx/src/executors/run-commands/run-commands.impl.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.interpolateArgsIntoCommand = void 0;
var child_process_1 = require("child_process");
var yargsParser = require("yargs-parser");
var propKeys = ["command", "cwd", "args"];
function buildExecutor(options) {
    return __awaiter(this, void 0, void 0, function () {
        var normalized;
        return __generator(this, function (_a) {
            normalized = normalizeOptions(options);
            (0, child_process_1.execSync)(normalized.commands[0].command, {
                cwd: normalized.cwd,
                stdio: ["inherit", "inherit", "inherit"],
                maxBuffer: 1024 * 1000000
            });
            return [2 /*return*/, { success: true }];
        });
    });
}
exports["default"] = buildExecutor;
function normalizeOptions(options) {
    options.parsedArgs = parseArgs(options);
    options.commands = [{ command: options.command }];
    options.commands.forEach(function (c) {
        c.command = interpolateArgsIntoCommand(c.command, options, true);
    });
    return options;
}
function parseArgs(options) {
    var args = options.args;
    if (!args) {
        var unknownOptionsTreatedAsArgs = Object.keys(options)
            .filter(function (p) { return propKeys.indexOf(p) === -1; })
            .reduce(function (m, c) { return ((m[c] = options[c]), m); }, {});
        return unknownOptionsTreatedAsArgs;
    }
    return yargsParser(args.replace(/(^"|"$)/g, ""), {
        configuration: { "camel-case-expansion": false }
    });
}
function interpolateArgsIntoCommand(command, opts, forwardAllArgs) {
    if (command.indexOf("{args.") > -1) {
        var regex = /{args\.([^}]+)}/g;
        return command.replace(regex, function (_, group) { return opts.parsedArgs[group]; });
    }
    else if (forwardAllArgs) {
        return "".concat(command).concat(opts.__unparsed__.length > 0
            ? " " + opts.__unparsed__.join(" ")
            : "");
    }
    else {
        return command;
    }
}
exports.interpolateArgsIntoCommand = interpolateArgsIntoCommand;
