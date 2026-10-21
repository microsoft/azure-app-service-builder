import{readFile as g,writeFile as j,mkdir as I}from"node:fs/promises";import x from"node:path";import{fileURLToPath as k}from"node:url";import{createHash as C}from"node:crypto";var u={version:"1.0.0",observedAt:"2026-10-13T19:45:00.000Z",repositoryIds:{"static-html":"1416066836",vite:"1416097070",nodejs:"1416093630",python:"1416094709",dotnet:"1416095899","mcp-server":"1416097969","ai-agent":"1416099091",php:"1417069573"},starters:[{id:"static-html",name:"Static HTML",repository:"Azure-Samples/app-service-builder-static-html",branch:"main",commit:"37efdfc6b22f6f58729e4ed6dedc79e3ba88b2fb",runtime:"Static files",description:"Dependency-free HTML and static health asset.",requirements:["Node.js 24 for local checks; no hosted runtime."],manifest:`components:
  - name: site
    role: static
    output: public
`},{id:"vite",name:"Vite + TypeScript",repository:"Azure-Samples/app-service-builder-vite",branch:"main",commit:"fe55edd99fb558ca490f8aaff70ba5bf2eaaaa98",runtime:"Node.js 24 static build",description:"TypeScript frontend built into static files; not the historical React starter.",requirements:["Node.js 24, npm and committed lockfile."],manifest:`components:
  - name: site
    role: static
    platform: nodejs
    platformVersion: "24"
    output: dist
`},{id:"nodejs",name:"Node.js HTTP app",repository:"Azure-Samples/app-service-builder-nodejs",branch:"main",commit:"ac1fafc6a0f32efce9bbf46b056ceddb30b3e195",runtime:"Node.js 24",description:"Dependency-free HTTP greeting and health endpoint.",requirements:["Node.js 24 and npm."],manifest:`components:
  - name: web
    role: web
    platform: nodejs
    platformVersion: "24"
    run:
      start: node server.mjs
      healthCheckPath: /health
`},{id:"python",name:"Python HTTP app",repository:"Azure-Samples/app-service-builder-python",branch:"main",commit:"cd22831c5da84e24e17edfe7b84b061a32ed0603",runtime:"Python 3.14",description:"Standard-library HTTP app, separate from the retired Python payload.",requirements:["Python 3.14; keep requirements.txt at repository root."],manifest:`components:
  - name: web
    role: web
    platform: python
    platformVersion: "3.14"
    run:
      start: python app.py
      healthCheckPath: /health
`},{id:"dotnet",name:".NET HTTP app",repository:"Azure-Samples/app-service-builder-dotnet",branch:"main",commit:"f2dddd107acff2e915a157f62a50b4e5ec96fd0a",runtime:".NET 10",description:"Minimal ASP.NET app with no NuGet package dependencies.",requirements:[".NET 10 SDK; retain global.json and NuGet.Config."],manifest:`components:
  - name: web
    role: web
    platform: dotnet
    platformVersion: "10"
    run:
      start: dotnet BuilderDotnetSample.dll
      healthCheckPath: /health
`},{id:"mcp-server",name:"HTTP MCP server",repository:"Azure-Samples/app-service-builder-mcp-server",branch:"main",commit:"a6ab9b2b91049525870dac5522a94b8a82229691",runtime:"Node.js 24",description:"Authenticated HTTP MCP endpoint with a bounded read-only text tool.",requirements:["Pinned MCP dependencies and Node.js 24.","APP_API_TOKEN via an approved secret store; never enter credentials in this canvas.","MCP protocol and negative authorization checks; public health is not authentication proof."],manifest:`components:
  - name: web
    role: web
    platform: nodejs
    platformVersion: "24"
    run:
      start: node server.mjs
      healthCheckPath: /health
`},{id:"ai-agent",name:"AI assistant HTTP API",repository:"Azure-Samples/app-service-builder-ai-agent",branch:"main",commit:"1c24a5e371deea3703d63244a4f46d21bd360f2d",runtime:"Node.js 24",description:"Authenticated single-turn API calling a separately configured model service.",requirements:["APP_API_TOKEN and separate authorized OpenAI/Azure OpenAI model service; no credentials collected here.","Separate model charges, budgets/quotas and negative authorization checks.","Builder does not provision a model or supply agent orchestration."],manifest:`components:
  - name: web
    role: web
    platform: nodejs
    platformVersion: "24"
    run:
      start: node server.mjs
      healthCheckPath: /health
`},{id:"php",name:"PHP HTTP app",repository:"Azure-Samples/app-service-builder-php",branch:"main",commit:"b3e796d51be0576db14247cbf2efa2dc182da4e1",runtime:"PHP 8.5",description:"Dependency-free PHP greeting and health endpoint.",requirements:["PHP 8.5, Composer 2; Python for local tests."],manifest:`components:
  - name: web
    role: web
    platform: php
    platformVersion: "8.5"
    run:
      healthCheckPath: /health.php
`}]};var T="microsoft/azure-app-service-builder",D=`https://raw.githubusercontent.com/${T}/main/canvas-content/approved.json`,N=96*1024,P=["prerequisites","source-and-manifest","deployment","operations"],m=/^(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})$/,h=/^[a-f0-9]{40}$/,q=/^[a-f0-9]{64}$/,f=class extends Error{constructor(i,n){super(n),this.code=i}},a=e=>{throw new f("content-invalid",e)},v=e=>C("sha256").update(e).digest("hex"),p=e=>JSON.stringify(e)+`
`;function E(e,i){(!m.test(e)||!m.test(i))&&a("Content versions must use numeric major.minor.patch.");let n=e.split(".").map(Number),r=i.split(".").map(Number);for(let t=0;t<3;t++)if(n[t]!==r[t])return n[t]<r[t]?-1:1;return 0}function d(e,i){(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).sort().join("|")!==[...i].sort().join("|"))&&a("The content schema contains missing or unsupported fields.")}function s(e,i,n){(typeof e!="string"||!e.length||e.length>i||e.includes("\0")||n&&!n.test(e))&&a("The content contains an invalid or oversized text field.")}function A(e){s(e.version,30,m),s(e.runtimeMin,30,m),s(e.runtimeMaxExclusive,30,m),E(e.runtimeMin,e.runtimeMaxExclusive)>=0&&a("Content runtime compatibility is invalid.")}function z(e){d(e,["schemaVersion","version","runtimeMin","runtimeMaxExclusive","guidance","catalog"]),e.schemaVersion!==1&&a("The content schema is not supported by this runtime."),A(e);let i=e.guidance;d(i,["repository","commit","pluginVersion","cliVersion","license","skill","references","licenseText"]),(i.repository!==T||i.license!=="MIT")&&a("Guidance must retain its approved repository and MIT license."),s(i.commit,40,h);for(let t of["pluginVersion","cliVersion"])s(i[t],50,/^[a-zA-Z0-9.+-]+$/);s(i.skill,32768),s(i.licenseText,8192),i.licenseText.includes("MIT License")||a("The guidance license text is missing."),d(i.references,P);for(let t of P)s(i.references[t],32768);Buffer.byteLength(JSON.stringify(i))>65536&&a("Guidance exceeds its bounded context size.");let n=e.catalog;d(n,["version","observedAt","repositoryIds","starters"]),s(n.version,30,m),s(n.observedAt,30),Number.isFinite(Date.parse(n.observedAt))||a("Catalog observation date is invalid."),d(n.repositoryIds,u.starters.map(t=>t.id)),(!Array.isArray(n.starters)||n.starters.length!==u.starters.length)&&a("The template inventory must contain the supported starter IDs.");let r=new Set;for(let t of n.starters){d(t,["id","name","repository","branch","commit","runtime","description","requirements","manifest"]);let o=u.starters.find(c=>c.id===t.id);(!o||r.has(t.id)||t.repository!==o.repository||n.repositoryIds[t.id]!==u.repositoryIds[t.id])&&a("Template repository identities must match this runtime's approved Azure-Samples inventory."),r.add(t.id),s(t.commit,40,h),s(t.branch,200,/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/),(t.branch.includes("..")||t.branch.includes("//"))&&a("Template branch is invalid.");for(let c of["name","runtime","description"])s(t[c],c==="description"?1e3:200);s(t.manifest,8192),(!Array.isArray(t.requirements)||t.requirements.length>10)&&a("Template requirements must be bounded.");for(let c of t.requirements)s(c,1e3)}return Buffer.byteLength(p(e))>N&&a("Content exceeds its total size limit."),e}function b(e){return z(e),{version:e.version,digest:v(p(e)),bundle:e}}function y(e){return d(e,["schemaVersion","version","runtimeMin","runtimeMaxExclusive","commit","path","sha256"]),e.schemaVersion!==1&&a("The approved content pointer schema is unsupported."),A(e),s(e.commit,40,h),s(e.sha256,64,q),e.path!==`canvas-content/versions/${e.version}/content.json`&&a("The content pointer must name its exact approved versioned path."),e}async function S(e,i){let n=await g(e);if(n.length>96*1024)throw new Error("Content exceeds 96 KiB.");let r=JSON.parse(n),t=b(r);if(n.toString("utf8")!==p(r))throw new Error("Use compact JSON plus one final LF.");if(i){let o=y(JSON.parse(await g(i,"utf8")));if(o.version!==r.version||o.sha256!==t.digest||o.runtimeMin!==r.runtimeMin||o.runtimeMaxExclusive!==r.runtimeMaxExclusive)throw new Error("Pointer identity does not match content bytes.")}return t}async function H(e){let[i,n,r,t]=e;if(i==="validate"&&n&&e.length<=3){let o=await S(n,r);return`Validated content ${o.version}; SHA-256 ${o.digest}`}if(i==="generate"&&n&&r&&e.length===3){let o=await g(n);if(o.length>96*1024)throw new Error("Reviewed input exceeds 96 KiB.");let c=JSON.parse(o),l=b(c),w=x.join(r,"canvas-content","versions",l.version,"content.json");return await I(x.dirname(w),{recursive:!0}),await j(w,p(c),{flag:"wx"}),`Generated immutable content ${l.version}; SHA-256 ${l.digest}`}if(i==="pointer"&&n&&r&&t&&e.length===4){let o=await S(n),c=o.bundle,l=y({schemaVersion:1,version:o.version,runtimeMin:c.runtimeMin,runtimeMaxExclusive:c.runtimeMaxExclusive,commit:r,path:`canvas-content/versions/${o.version}/content.json`,sha256:v(p(c))});return await j(t,JSON.stringify(l,null,2)+`
`,{flag:"wx"}),"Generated candidate pointer. Offline validation does not establish that the supplied commit exists or was approved."}throw new Error("Usage: canvas-content.mjs validate <bundle> [pointer] | generate <reviewed-json> <repo-root> | pointer <bundle> <actual-40-char-content-commit> <new-output-file>")}if(process.argv[1]&&x.resolve(process.argv[1])===k(import.meta.url))try{console.log(await H(process.argv.slice(2)))}catch(e){console.error(e.message),process.exitCode=1}export{H as run,S as validateFile};
