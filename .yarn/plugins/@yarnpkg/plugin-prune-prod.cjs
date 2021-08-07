/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-prune-prod",
factory: function (require) {
var plugin=(()=>{var d=Object.create,c=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var g=t=>c(t,"__esModule",{value:!0});var r=t=>{if(typeof require!="undefined")return require(t);throw new Error('Dynamic require of "'+t+'" is not supported')};var h=(t,e)=>{for(var a in e)c(t,a,{get:e[a],enumerable:!0})},x=(t,e,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of f(e))!w.call(t,o)&&o!=="default"&&c(t,o,{get:()=>e[o],enumerable:!(a=u(e,o))||a.enumerable});return t},p=t=>x(g(c(t!=null?d(m(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var k={};h(k,{default:()=>j});var l=p(r("@yarnpkg/cli")),s=p(r("@yarnpkg/core")),i=class extends l.BaseCommand{async execute(){let e=await s.Configuration.find(this.context.cwd,this.context.plugins),{project:a}=await s.Project.find(e,this.context.cwd),o=await s.Cache.find(e);await a.restoreInstallState({restoreResolutions:!1});for(let n of a.workspaces)n.manifest.devDependencies.clear();return(await s.StreamReport.start({configuration:e,json:!1,stdout:this.context.stdout,includeLogs:!0},async n=>{await a.install({cache:o,report:n,persistProject:!1}),await a.cacheCleanup({cache:o,report:n})})).exitCode()}};i.paths=[["prune-prod"]];var C={commands:[i]},j=C;return k;})();
return plugin;
}
};
