(()=>{var a={};a.id=9548,a.ids=[9548],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28620:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{GET:()=>x});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(92197),w=c(69200);async function x(){let a=await (0,v.Z)();if(a)return a;let b=await (0,w.wx)();return u.NextResponse.json(b)}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/admin/dashboard-stats/route",pathname:"/api/admin/dashboard-stats",filename:"route",bundlePath:"app/api/admin/dashboard-stats/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/workspaces/hass-properties/src/app/api/admin/dashboard-stats/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/api/admin/dashboard-stats/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},35552:(a,b,c)=>{"use strict";c.d(b,{A:()=>d});let d=(0,c(9608).lw)(process.env.DATABASE_URL)},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48152:(a,b,c)=>{"use strict";c.d(b,{U:()=>f});var d=c(67596),e=c(86802);async function f(){let a=await (0,e.UL)();return(0,d.createServerClient)(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>a.getAll(),setAll(b){try{b.forEach(({name:b,value:c,options:d})=>a.set(b,c,d))}catch{}}}})}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},69200:(a,b,c)=>{"use strict";c.d(b,{$x:()=>k,BJ:()=>l,IL:()=>j,Xc:()=>e,cL:()=>m,pw:()=>h,qz:()=>g,ty:()=>i,wH:()=>f,wx:()=>n});var d=c(35552);async function e(){return await (0,d.A)`SELECT * FROM properties ORDER BY CASE WHEN status = 'Sold' THEN 1 ELSE 0 END, created_at DESC`}async function f(a=6){return await (0,d.A)`SELECT * FROM properties WHERE featured = true ORDER BY created_at DESC LIMIT ${a}`}async function g(a){let[b]=await (0,d.A)`SELECT * FROM properties WHERE id = ${a}`;return b||null}async function h(a,b,c,e=12){return await (0,d.A)`
    SELECT *
    FROM properties
    WHERE id != ${c} AND status != 'Sold'
    ORDER BY
      CASE
        WHEN category = ${a} AND location ILIKE '%' || COALESCE(${b}, '') || '%' THEN 0
        WHEN category = ${a} THEN 1
        ELSE 2
      END,
      created_at DESC
    LIMIT ${e}
  `}async function i(a,b,c){let e=await (0,d.A)`SELECT * FROM properties ORDER BY CASE WHEN status = 'Sold' THEN 1 ELSE 0 END, created_at DESC`;if(c?.search){let a=c.search.toLowerCase();e=e.filter(b=>b.title.toLowerCase().includes(a)||b.location.toLowerCase().includes(a))}c?.category&&"All"!==c.category&&(e=e.filter(a=>a.category===c.category)),c?.status&&"All"!==c.status&&(e=e.filter(a=>a.status===c.status));let f=e.length,g=(a-1)*b;return{data:e.slice(g,g+b),total:f}}async function j(a){let b=a.image_metadata?JSON.stringify(a.image_metadata):null,c=Array.isArray(a.images)?a.images:null,[e]=await (0,d.A)`
    INSERT INTO properties (
      title, description, price, location, category, type, status, featured,
      image_url, images, image_metadata, video_url, beds, baths, area,
      make, model, year, mileage, transmission, fuel_type
    ) VALUES (
      ${a.title}, ${a.description}, ${a.price}, ${a.location},
      ${a.category}, ${a.type}, ${a.status}, ${a.featured??!1},
      ${a.image_url}, ${c}::text[], ${b}, ${a.video_url||null},
      ${a.beds||null}, ${a.baths||null}, ${a.area||null},
      ${a.make||null}, ${a.model||null}, ${a.year||null},
      ${a.mileage||null}, ${a.transmission||null}, ${a.fuel_type||null}
    ) RETURNING *
  `;return e}async function k(a,b){let c=void 0!==b.image_metadata?JSON.stringify(b.image_metadata):null,e=Array.isArray(b.images)?b.images:null,[f]=await (0,d.A)`
    UPDATE properties SET
      title = COALESCE(${b.title}, title),
      description = COALESCE(${b.description}, description),
      price = COALESCE(${b.price}, price),
      location = COALESCE(${b.location}, location),
      category = COALESCE(${b.category}, category),
      type = COALESCE(${b.type}, type),
      status = COALESCE(${b.status}, status),
      image_url = COALESCE(${b.image_url}, image_url),
      featured = COALESCE(${b.featured}, featured),
      images = COALESCE(${e}::text[], images),
      image_metadata = COALESCE(${c}::jsonb, image_metadata),
      video_url = COALESCE(${b.video_url||null}, video_url),
      beds = COALESCE(${b.beds||null}, beds),
      baths = COALESCE(${b.baths||null}, baths),
      area = COALESCE(${b.area||null}, area),
      make = COALESCE(${b.make||null}, make),
      model = COALESCE(${b.model||null}, model),
      year = COALESCE(${b.year||null}, year),
      mileage = COALESCE(${b.mileage||null}, mileage),
      transmission = COALESCE(${b.transmission||null}, transmission),
      fuel_type = COALESCE(${b.fuel_type||null}, fuel_type),
      updated_at = NOW()
    WHERE id = ${a}
    RETURNING *
  `;return f||null}async function l(a){return(await (0,d.A)`DELETE FROM properties WHERE id = ${a} RETURNING id`).length>0}async function m(a=10){return await (0,d.A)`
    SELECT id, title, price, status, image_url 
    FROM properties 
    ORDER BY CASE WHEN status = 'Sold' THEN 1 ELSE 0 END, created_at DESC LIMIT ${a}
  `}async function n(){let[a]=await (0,d.A)`
    SELECT
      COUNT(*)::int AS "totalProperties",
      COUNT(*) FILTER (WHERE status = 'For Sale')::int AS "forSale",
      COUNT(*) FILTER (WHERE status = 'For Rent')::int AS "forRent",
      COUNT(*) FILTER (WHERE category IN ('Cars', 'Motorcycles'))::int AS "vehicles"
    FROM properties
  `;return a}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},92197:(a,b,c)=>{"use strict";c.d(b,{Z:()=>g});var d=c(48152),e=c(10641);let f=(process.env.ADMIN_EMAILS||"").split(",").map(a=>a.trim().toLowerCase()).filter(Boolean);async function g(){try{let a=await (0,d.U)(),{data:{session:b}}=await a.auth.getSession();if(!b?.user)return e.NextResponse.json({error:"Unauthorized"},{status:401});if(f.length>0){let a=b.user.email?.toLowerCase();if(!a||!f.includes(a))return e.NextResponse.json({error:"Forbidden"},{status:403})}}catch(a){return console.error("require-admin error:",a),e.NextResponse.json({error:"Forbidden"},{status:403})}}},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[1331,9608,1692,3021],()=>b(b.s=28620));module.exports=c})();