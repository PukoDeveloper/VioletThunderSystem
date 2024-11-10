!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.semver=r():e.semver=r()}(this,(()=>{return e={864:(e,r,t)=>{const s=Symbol("SemVer ANY");class o{static get ANY(){return s}constructor(e,r){if(r=n(r),e instanceof o){if(e.loose===!!r.loose)return e;e=e.value}e=e.trim().split(/\s+/).join(" "),p("comparator",e,r),this.options=r,this.loose=!!r.loose,this.parse(e),this.semver===s?this.value="":this.value=this.operator+this.semver.version,p("comp",this)}parse(e){const r=this.options.loose?i[a.COMPARATORLOOSE]:i[a.COMPARATOR],t=e.match(r);if(!t)throw new TypeError(`Invalid comparator: ${e}`);this.operator=void 0!==t[1]?t[1]:"","="===this.operator&&(this.operator=""),t[2]?this.semver=new E(t[2],this.options.loose):this.semver=s}toString(){return this.value}test(e){if(p("Comparator.test",e,this.options.loose),this.semver===s||e===s)return!0;if("string"==typeof e)try{e=new E(e,this.options)}catch(e){return!1}return l(e,this.operator,this.semver,this.options)}intersects(e,r){if(!(e instanceof o))throw new TypeError("a Comparator is required");return""===this.operator?""===this.value||new c(e.value,r).test(this.value):""===e.operator?""===e.value||new c(this.value,r).test(e.semver):!((r=n(r)).includePrerelease&&("<0.0.0-0"===this.value||"<0.0.0-0"===e.value)||!r.includePrerelease&&(this.value.startsWith("<0.0.0")||e.value.startsWith("<0.0.0"))||(!this.operator.startsWith(">")||!e.operator.startsWith(">"))&&(!this.operator.startsWith("<")||!e.operator.startsWith("<"))&&(this.semver.version!==e.semver.version||!this.operator.includes("=")||!e.operator.includes("="))&&!(l(this.semver,"<",e.semver,r)&&this.operator.startsWith(">")&&e.operator.startsWith("<"))&&!(l(this.semver,">",e.semver,r)&&this.operator.startsWith("<")&&e.operator.startsWith(">")))}}e.exports=o;const n=t(235),{safeRe:i,t:a}=t(622),l=t(631),p=t(216),E=t(572),c=t(215)},215:(e,r,t)=>{const s=/\s+/g;class o{constructor(e,r){if(r=i(r),e instanceof o)return e.loose===!!r.loose&&e.includePrerelease===!!r.includePrerelease?e:new o(e.raw,r);if(e instanceof a)return this.raw=e.value,this.set=[[e]],this.formatted=void 0,this;if(this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease,this.raw=e.trim().replace(s," "),this.set=this.raw.split("||").map((e=>this.parseRange(e.trim()))).filter((e=>e.length)),!this.set.length)throw new TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){const e=this.set[0];if(this.set=this.set.filter((e=>!R(e[0]))),0===this.set.length)this.set=[e];else if(this.set.length>1)for(const e of this.set)if(1===e.length&&I(e[0])){this.set=[e];break}}this.formatted=void 0}get range(){if(void 0===this.formatted){this.formatted="";for(let e=0;e<this.set.length;e++){e>0&&(this.formatted+="||");const r=this.set[e];for(let e=0;e<r.length;e++)e>0&&(this.formatted+=" "),this.formatted+=r[e].toString().trim()}}return this.formatted}format(){return this.range}toString(){return this.range}parseRange(e){const r=((this.options.includePrerelease&&$)|(this.options.loose&&f))+":"+e,t=n.get(r);if(t)return t;const s=this.options.loose,o=s?E[c.HYPHENRANGELOOSE]:E[c.HYPHENRANGE];e=e.replace(o,x(this.options.includePrerelease)),l("hyphen replace",e),e=e.replace(E[c.COMPARATORTRIM],h),l("comparator trim",e),e=e.replace(E[c.TILDETRIM],u),l("tilde trim",e),e=e.replace(E[c.CARETTRIM],m),l("caret trim",e);let i=e.split(" ").map((e=>N(e,this.options))).join(" ").split(/\s+/).map((e=>P(e,this.options)));s&&(i=i.filter((e=>(l("loose invalid filter",e,this.options),!!e.match(E[c.COMPARATORLOOSE]))))),l("range list",i);const p=new Map,I=i.map((e=>new a(e,this.options)));for(const e of I){if(R(e))return[e];p.set(e.value,e)}p.size>1&&p.has("")&&p.delete("");const L=[...p.values()];return n.set(r,L),L}intersects(e,r){if(!(e instanceof o))throw new TypeError("a Range is required");return this.set.some((t=>L(t,r)&&e.set.some((e=>L(e,r)&&t.every((t=>e.every((e=>t.intersects(e,r)))))))))}test(e){if(!e)return!1;if("string"==typeof e)try{e=new p(e,this.options)}catch(e){return!1}for(let r=0;r<this.set.length;r++)if(C(this.set[r],e,this.options))return!0;return!1}}e.exports=o;const n=new(t(818)),i=t(235),a=t(864),l=t(216),p=t(572),{safeRe:E,t:c,comparatorTrimReplace:h,tildeTrimReplace:u,caretTrimReplace:m}=t(622),{FLAG_INCLUDE_PRERELEASE:$,FLAG_LOOSE:f}=t(546),R=e=>"<0.0.0-0"===e.value,I=e=>""===e.value,L=(e,r)=>{let t=!0;const s=e.slice();let o=s.pop();for(;t&&s.length;)t=s.every((e=>o.intersects(e,r))),o=s.pop();return t},N=(e,r)=>(l("comp",e,r),e=A(e,r),l("caret",e),e=O(e,r),l("tildes",e),e=g(e,r),l("xrange",e),e=w(e,r),l("stars",e),e),v=e=>!e||"x"===e.toLowerCase()||"*"===e,O=(e,r)=>e.trim().split(/\s+/).map((e=>d(e,r))).join(" "),d=(e,r)=>{const t=r.loose?E[c.TILDELOOSE]:E[c.TILDE];return e.replace(t,((r,t,s,o,n)=>{let i;return l("tilde",e,r,t,s,o,n),v(t)?i="":v(s)?i=`>=${t}.0.0 <${+t+1}.0.0-0`:v(o)?i=`>=${t}.${s}.0 <${t}.${+s+1}.0-0`:n?(l("replaceTilde pr",n),i=`>=${t}.${s}.${o}-${n} <${t}.${+s+1}.0-0`):i=`>=${t}.${s}.${o} <${t}.${+s+1}.0-0`,l("tilde return",i),i}))},A=(e,r)=>e.trim().split(/\s+/).map((e=>T(e,r))).join(" "),T=(e,r)=>{l("caret",e,r);const t=r.loose?E[c.CARETLOOSE]:E[c.CARET],s=r.includePrerelease?"-0":"";return e.replace(t,((r,t,o,n,i)=>{let a;return l("caret",e,r,t,o,n,i),v(t)?a="":v(o)?a=`>=${t}.0.0${s} <${+t+1}.0.0-0`:v(n)?a="0"===t?`>=${t}.${o}.0${s} <${t}.${+o+1}.0-0`:`>=${t}.${o}.0${s} <${+t+1}.0.0-0`:i?(l("replaceCaret pr",i),a="0"===t?"0"===o?`>=${t}.${o}.${n}-${i} <${t}.${o}.${+n+1}-0`:`>=${t}.${o}.${n}-${i} <${t}.${+o+1}.0-0`:`>=${t}.${o}.${n}-${i} <${+t+1}.0.0-0`):(l("no pr"),a="0"===t?"0"===o?`>=${t}.${o}.${n}${s} <${t}.${o}.${+n+1}-0`:`>=${t}.${o}.${n}${s} <${t}.${+o+1}.0-0`:`>=${t}.${o}.${n} <${+t+1}.0.0-0`),l("caret return",a),a}))},g=(e,r)=>(l("replaceXRanges",e,r),e.split(/\s+/).map((e=>S(e,r))).join(" ")),S=(e,r)=>{e=e.trim();const t=r.loose?E[c.XRANGELOOSE]:E[c.XRANGE];return e.replace(t,((t,s,o,n,i,a)=>{l("xRange",e,t,s,o,n,i,a);const p=v(o),E=p||v(n),c=E||v(i),h=c;return"="===s&&h&&(s=""),a=r.includePrerelease?"-0":"",p?t=">"===s||"<"===s?"<0.0.0-0":"*":s&&h?(E&&(n=0),i=0,">"===s?(s=">=",E?(o=+o+1,n=0,i=0):(n=+n+1,i=0)):"<="===s&&(s="<",E?o=+o+1:n=+n+1),"<"===s&&(a="-0"),t=`${s+o}.${n}.${i}${a}`):E?t=`>=${o}.0.0${a} <${+o+1}.0.0-0`:c&&(t=`>=${o}.${n}.0${a} <${o}.${+n+1}.0-0`),l("xRange return",t),t}))},w=(e,r)=>(l("replaceStars",e,r),e.trim().replace(E[c.STAR],"")),P=(e,r)=>(l("replaceGTE0",e,r),e.trim().replace(E[r.includePrerelease?c.GTE0PRE:c.GTE0],"")),x=e=>(r,t,s,o,n,i,a,l,p,E,c,h)=>`${t=v(s)?"":v(o)?`>=${s}.0.0${e?"-0":""}`:v(n)?`>=${s}.${o}.0${e?"-0":""}`:i?`>=${t}`:`>=${t}${e?"-0":""}`} ${l=v(p)?"":v(E)?`<${+p+1}.0.0-0`:v(c)?`<${p}.${+E+1}.0-0`:h?`<=${p}.${E}.${c}-${h}`:e?`<${p}.${E}.${+c+1}-0`:`<=${l}`}`.trim(),C=(e,r,t)=>{for(let t=0;t<e.length;t++)if(!e[t].test(r))return!1;if(r.prerelease.length&&!t.includePrerelease){for(let t=0;t<e.length;t++)if(l(e[t].semver),e[t].semver!==a.ANY&&e[t].semver.prerelease.length>0){const s=e[t].semver;if(s.major===r.major&&s.minor===r.minor&&s.patch===r.patch)return!0}return!1}return!0}},572:(e,r,t)=>{const s=t(216),{MAX_LENGTH:o,MAX_SAFE_INTEGER:n}=t(546),{safeRe:i,t:a}=t(622),l=t(235),{compareIdentifiers:p}=t(171);class E{constructor(e,r){if(r=l(r),e instanceof E){if(e.loose===!!r.loose&&e.includePrerelease===!!r.includePrerelease)return e;e=e.version}else if("string"!=typeof e)throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);if(e.length>o)throw new TypeError(`version is longer than ${o} characters`);s("SemVer",e,r),this.options=r,this.loose=!!r.loose,this.includePrerelease=!!r.includePrerelease;const t=e.trim().match(r.loose?i[a.LOOSE]:i[a.FULL]);if(!t)throw new TypeError(`Invalid Version: ${e}`);if(this.raw=e,this.major=+t[1],this.minor=+t[2],this.patch=+t[3],this.major>n||this.major<0)throw new TypeError("Invalid major version");if(this.minor>n||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>n||this.patch<0)throw new TypeError("Invalid patch version");t[4]?this.prerelease=t[4].split(".").map((e=>{if(/^[0-9]+$/.test(e)){const r=+e;if(r>=0&&r<n)return r}return e})):this.prerelease=[],this.build=t[5]?t[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(s("SemVer.compare",this.version,this.options,e),!(e instanceof E)){if("string"==typeof e&&e===this.version)return 0;e=new E(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(e){return e instanceof E||(e=new E(e,this.options)),p(this.major,e.major)||p(this.minor,e.minor)||p(this.patch,e.patch)}comparePre(e){if(e instanceof E||(e=new E(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let r=0;do{const t=this.prerelease[r],o=e.prerelease[r];if(s("prerelease compare",r,t,o),void 0===t&&void 0===o)return 0;if(void 0===o)return 1;if(void 0===t)return-1;if(t!==o)return p(t,o)}while(++r)}compareBuild(e){e instanceof E||(e=new E(e,this.options));let r=0;do{const t=this.build[r],o=e.build[r];if(s("build compare",r,t,o),void 0===t&&void 0===o)return 0;if(void 0===o)return 1;if(void 0===t)return-1;if(t!==o)return p(t,o)}while(++r)}inc(e,r,t){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",r,t);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",r,t);break;case"prepatch":this.prerelease.length=0,this.inc("patch",r,t),this.inc("pre",r,t);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",r,t),this.inc("pre",r,t);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":{const e=Number(t)?1:0;if(!r&&!1===t)throw new Error("invalid increment argument: identifier is empty");if(0===this.prerelease.length)this.prerelease=[e];else{let s=this.prerelease.length;for(;--s>=0;)"number"==typeof this.prerelease[s]&&(this.prerelease[s]++,s=-2);if(-1===s){if(r===this.prerelease.join(".")&&!1===t)throw new Error("invalid increment argument: identifier already exists");this.prerelease.push(e)}}if(r){let s=[r,e];!1===t&&(s=[r]),0===p(this.prerelease[0],r)?isNaN(this.prerelease[1])&&(this.prerelease=s):this.prerelease=s}break}default:throw new Error(`invalid increment argument: ${e}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}}e.exports=E},910:(e,r,t)=>{const s=t(544);e.exports=(e,r)=>{const t=s(e.trim().replace(/^[=v]+/,""),r);return t?t.version:null}},631:(e,r,t)=>{const s=t(577),o=t(503),n=t(396),i=t(65),a=t(571),l=t(424);e.exports=(e,r,t,p)=>{switch(r){case"===":return"object"==typeof e&&(e=e.version),"object"==typeof t&&(t=t.version),e===t;case"!==":return"object"==typeof e&&(e=e.version),"object"==typeof t&&(t=t.version),e!==t;case"":case"=":case"==":return s(e,t,p);case"!=":return o(e,t,p);case">":return n(e,t,p);case">=":return i(e,t,p);case"<":return a(e,t,p);case"<=":return l(e,t,p);default:throw new TypeError(`Invalid operator: ${r}`)}}},162:(e,r,t)=>{const s=t(572),o=t(544),{safeRe:n,t:i}=t(622);e.exports=(e,r)=>{if(e instanceof s)return e;if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return null;let t=null;if((r=r||{}).rtl){const s=r.includePrerelease?n[i.COERCERTLFULL]:n[i.COERCERTL];let o;for(;(o=s.exec(e))&&(!t||t.index+t[0].length!==e.length);)t&&o.index+o[0].length===t.index+t[0].length||(t=o),s.lastIndex=o.index+o[1].length+o[2].length;s.lastIndex=-1}else t=e.match(r.includePrerelease?n[i.COERCEFULL]:n[i.COERCE]);if(null===t)return null;const a=t[2],l=t[3]||"0",p=t[4]||"0",E=r.includePrerelease&&t[5]?`-${t[5]}`:"",c=r.includePrerelease&&t[6]?`+${t[6]}`:"";return o(`${a}.${l}.${p}${E}${c}`,r)}},493:(e,r,t)=>{const s=t(572);e.exports=(e,r,t)=>{const o=new s(e,t),n=new s(r,t);return o.compare(n)||o.compareBuild(n)}},811:(e,r,t)=>{const s=t(344);e.exports=(e,r)=>s(e,r,!0)},344:(e,r,t)=>{const s=t(572);e.exports=(e,r,t)=>new s(e,t).compare(new s(r,t))},312:(e,r,t)=>{const s=t(544);e.exports=(e,r)=>{const t=s(e,null,!0),o=s(r,null,!0),n=t.compare(o);if(0===n)return null;const i=n>0,a=i?t:o,l=i?o:t,p=!!a.prerelease.length;if(l.prerelease.length&&!p)return l.patch||l.minor?a.patch?"patch":a.minor?"minor":"major":"major";const E=p?"pre":"";return t.major!==o.major?E+"major":t.minor!==o.minor?E+"minor":t.patch!==o.patch?E+"patch":"prerelease"}},577:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>0===s(e,r,t)},396:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>s(e,r,t)>0},65:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>s(e,r,t)>=0},511:(e,r,t)=>{const s=t(572);e.exports=(e,r,t,o,n)=>{"string"==typeof t&&(n=o,o=t,t=void 0);try{return new s(e instanceof s?e.version:e,t).inc(r,o,n).version}catch(e){return null}}},571:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>s(e,r,t)<0},424:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>s(e,r,t)<=0},410:(e,r,t)=>{const s=t(572);e.exports=(e,r)=>new s(e,r).major},198:(e,r,t)=>{const s=t(572);e.exports=(e,r)=>new s(e,r).minor},503:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>0!==s(e,r,t)},544:(e,r,t)=>{const s=t(572);e.exports=(e,r,t=!1)=>{if(e instanceof s)return e;try{return new s(e,r)}catch(e){if(!t)return null;throw e}}},989:(e,r,t)=>{const s=t(572);e.exports=(e,r)=>new s(e,r).patch},433:(e,r,t)=>{const s=t(544);e.exports=(e,r)=>{const t=s(e,r);return t&&t.prerelease.length?t.prerelease:null}},570:(e,r,t)=>{const s=t(344);e.exports=(e,r,t)=>s(r,e,t)},397:(e,r,t)=>{const s=t(493);e.exports=(e,r)=>e.sort(((e,t)=>s(t,e,r)))},654:(e,r,t)=>{const s=t(215);e.exports=(e,r,t)=>{try{r=new s(r,t)}catch(e){return!1}return r.test(e)}},399:(e,r,t)=>{const s=t(493);e.exports=(e,r)=>e.sort(((e,t)=>s(e,t,r)))},129:(e,r,t)=>{const s=t(544);e.exports=(e,r)=>{const t=s(e,r);return t?t.version:null}},237:(e,r,t)=>{const s=t(622),o=t(546),n=t(572),i=t(171),a=t(544),l=t(129),p=t(910),E=t(511),c=t(312),h=t(410),u=t(198),m=t(989),$=t(433),f=t(344),R=t(570),I=t(811),L=t(493),N=t(399),v=t(397),O=t(396),d=t(571),A=t(577),T=t(503),g=t(65),S=t(424),w=t(631),P=t(162),x=t(864),C=t(215),D=t(654),G=t(247),M=t(980),F=t(374),y=t(661),j=t(210),U=t(731),b=t(75),X=t(646),_=t(860),V=t(413),B=t(568);e.exports={parse:a,valid:l,clean:p,inc:E,diff:c,major:h,minor:u,patch:m,prerelease:$,compare:f,rcompare:R,compareLoose:I,compareBuild:L,sort:N,rsort:v,gt:O,lt:d,eq:A,neq:T,gte:g,lte:S,cmp:w,coerce:P,Comparator:x,Range:C,satisfies:D,toComparators:G,maxSatisfying:M,minSatisfying:F,minVersion:y,validRange:j,outside:U,gtr:b,ltr:X,intersects:_,simplifyRange:V,subset:B,SemVer:n,re:s.re,src:s.src,tokens:s.t,SEMVER_SPEC_VERSION:o.SEMVER_SPEC_VERSION,RELEASE_TYPES:o.RELEASE_TYPES,compareIdentifiers:i.compareIdentifiers,rcompareIdentifiers:i.rcompareIdentifiers}},546:e=>{const r=Number.MAX_SAFE_INTEGER||9007199254740991;e.exports={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:r,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}},216:e=>{const r="object"==typeof process&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};e.exports=r},171:e=>{const r=/^[0-9]+$/,t=(e,t)=>{const s=r.test(e),o=r.test(t);return s&&o&&(e=+e,t=+t),e===t?0:s&&!o?-1:o&&!s?1:e<t?-1:1};e.exports={compareIdentifiers:t,rcompareIdentifiers:(e,r)=>t(r,e)}},818:e=>{e.exports=class{constructor(){this.max=1e3,this.map=new Map}get(e){const r=this.map.get(e);return void 0===r?void 0:(this.map.delete(e),this.map.set(e,r),r)}delete(e){return this.map.delete(e)}set(e,r){if(!this.delete(e)&&void 0!==r){if(this.map.size>=this.max){const e=this.map.keys().next().value;this.delete(e)}this.map.set(e,r)}return this}}},235:e=>{const r=Object.freeze({loose:!0}),t=Object.freeze({});e.exports=e=>e?"object"!=typeof e?r:e:t},622:(e,r,t)=>{const{MAX_SAFE_COMPONENT_LENGTH:s,MAX_SAFE_BUILD_LENGTH:o,MAX_LENGTH:n}=t(546),i=t(216),a=(r=e.exports={}).re=[],l=r.safeRe=[],p=r.src=[],E=r.t={};let c=0;const h="[a-zA-Z0-9-]",u=[["\\s",1],["\\d",n],[h,o]],m=(e,r,t)=>{const s=(e=>{for(const[r,t]of u)e=e.split(`${r}*`).join(`${r}{0,${t}}`).split(`${r}+`).join(`${r}{1,${t}}`);return e})(r),o=c++;i(e,o,r),E[e]=o,p[o]=r,a[o]=new RegExp(r,t?"g":void 0),l[o]=new RegExp(s,t?"g":void 0)};m("NUMERICIDENTIFIER","0|[1-9]\\d*"),m("NUMERICIDENTIFIERLOOSE","\\d+"),m("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${h}*`),m("MAINVERSION",`(${p[E.NUMERICIDENTIFIER]})\\.(${p[E.NUMERICIDENTIFIER]})\\.(${p[E.NUMERICIDENTIFIER]})`),m("MAINVERSIONLOOSE",`(${p[E.NUMERICIDENTIFIERLOOSE]})\\.(${p[E.NUMERICIDENTIFIERLOOSE]})\\.(${p[E.NUMERICIDENTIFIERLOOSE]})`),m("PRERELEASEIDENTIFIER",`(?:${p[E.NUMERICIDENTIFIER]}|${p[E.NONNUMERICIDENTIFIER]})`),m("PRERELEASEIDENTIFIERLOOSE",`(?:${p[E.NUMERICIDENTIFIERLOOSE]}|${p[E.NONNUMERICIDENTIFIER]})`),m("PRERELEASE",`(?:-(${p[E.PRERELEASEIDENTIFIER]}(?:\\.${p[E.PRERELEASEIDENTIFIER]})*))`),m("PRERELEASELOOSE",`(?:-?(${p[E.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${p[E.PRERELEASEIDENTIFIERLOOSE]})*))`),m("BUILDIDENTIFIER",`${h}+`),m("BUILD",`(?:\\+(${p[E.BUILDIDENTIFIER]}(?:\\.${p[E.BUILDIDENTIFIER]})*))`),m("FULLPLAIN",`v?${p[E.MAINVERSION]}${p[E.PRERELEASE]}?${p[E.BUILD]}?`),m("FULL",`^${p[E.FULLPLAIN]}$`),m("LOOSEPLAIN",`[v=\\s]*${p[E.MAINVERSIONLOOSE]}${p[E.PRERELEASELOOSE]}?${p[E.BUILD]}?`),m("LOOSE",`^${p[E.LOOSEPLAIN]}$`),m("GTLT","((?:<|>)?=?)"),m("XRANGEIDENTIFIERLOOSE",`${p[E.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),m("XRANGEIDENTIFIER",`${p[E.NUMERICIDENTIFIER]}|x|X|\\*`),m("XRANGEPLAIN",`[v=\\s]*(${p[E.XRANGEIDENTIFIER]})(?:\\.(${p[E.XRANGEIDENTIFIER]})(?:\\.(${p[E.XRANGEIDENTIFIER]})(?:${p[E.PRERELEASE]})?${p[E.BUILD]}?)?)?`),m("XRANGEPLAINLOOSE",`[v=\\s]*(${p[E.XRANGEIDENTIFIERLOOSE]})(?:\\.(${p[E.XRANGEIDENTIFIERLOOSE]})(?:\\.(${p[E.XRANGEIDENTIFIERLOOSE]})(?:${p[E.PRERELEASELOOSE]})?${p[E.BUILD]}?)?)?`),m("XRANGE",`^${p[E.GTLT]}\\s*${p[E.XRANGEPLAIN]}$`),m("XRANGELOOSE",`^${p[E.GTLT]}\\s*${p[E.XRANGEPLAINLOOSE]}$`),m("COERCEPLAIN",`(^|[^\\d])(\\d{1,${s}})(?:\\.(\\d{1,${s}}))?(?:\\.(\\d{1,${s}}))?`),m("COERCE",`${p[E.COERCEPLAIN]}(?:$|[^\\d])`),m("COERCEFULL",p[E.COERCEPLAIN]+`(?:${p[E.PRERELEASE]})?`+`(?:${p[E.BUILD]})?(?:$|[^\\d])`),m("COERCERTL",p[E.COERCE],!0),m("COERCERTLFULL",p[E.COERCEFULL],!0),m("LONETILDE","(?:~>?)"),m("TILDETRIM",`(\\s*)${p[E.LONETILDE]}\\s+`,!0),r.tildeTrimReplace="$1~",m("TILDE",`^${p[E.LONETILDE]}${p[E.XRANGEPLAIN]}$`),m("TILDELOOSE",`^${p[E.LONETILDE]}${p[E.XRANGEPLAINLOOSE]}$`),m("LONECARET","(?:\\^)"),m("CARETTRIM",`(\\s*)${p[E.LONECARET]}\\s+`,!0),r.caretTrimReplace="$1^",m("CARET",`^${p[E.LONECARET]}${p[E.XRANGEPLAIN]}$`),m("CARETLOOSE",`^${p[E.LONECARET]}${p[E.XRANGEPLAINLOOSE]}$`),m("COMPARATORLOOSE",`^${p[E.GTLT]}\\s*(${p[E.LOOSEPLAIN]})$|^$`),m("COMPARATOR",`^${p[E.GTLT]}\\s*(${p[E.FULLPLAIN]})$|^$`),m("COMPARATORTRIM",`(\\s*)${p[E.GTLT]}\\s*(${p[E.LOOSEPLAIN]}|${p[E.XRANGEPLAIN]})`,!0),r.comparatorTrimReplace="$1$2$3",m("HYPHENRANGE",`^\\s*(${p[E.XRANGEPLAIN]})\\s+-\\s+(${p[E.XRANGEPLAIN]})\\s*$`),m("HYPHENRANGELOOSE",`^\\s*(${p[E.XRANGEPLAINLOOSE]})\\s+-\\s+(${p[E.XRANGEPLAINLOOSE]})\\s*$`),m("STAR","(<|>)?=?\\s*\\*"),m("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),m("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")},75:(e,r,t)=>{const s=t(731);e.exports=(e,r,t)=>s(e,r,">",t)},860:(e,r,t)=>{const s=t(215);e.exports=(e,r,t)=>(e=new s(e,t),r=new s(r,t),e.intersects(r,t))},646:(e,r,t)=>{const s=t(731);e.exports=(e,r,t)=>s(e,r,"<",t)},980:(e,r,t)=>{const s=t(572),o=t(215);e.exports=(e,r,t)=>{let n=null,i=null,a=null;try{a=new o(r,t)}catch(e){return null}return e.forEach((e=>{a.test(e)&&(n&&-1!==i.compare(e)||(n=e,i=new s(n,t)))})),n}},374:(e,r,t)=>{const s=t(572),o=t(215);e.exports=(e,r,t)=>{let n=null,i=null,a=null;try{a=new o(r,t)}catch(e){return null}return e.forEach((e=>{a.test(e)&&(n&&1!==i.compare(e)||(n=e,i=new s(n,t)))})),n}},661:(e,r,t)=>{const s=t(572),o=t(215),n=t(396);e.exports=(e,r)=>{e=new o(e,r);let t=new s("0.0.0");if(e.test(t))return t;if(t=new s("0.0.0-0"),e.test(t))return t;t=null;for(let r=0;r<e.set.length;++r){const o=e.set[r];let i=null;o.forEach((e=>{const r=new s(e.semver.version);switch(e.operator){case">":0===r.prerelease.length?r.patch++:r.prerelease.push(0),r.raw=r.format();case"":case">=":i&&!n(r,i)||(i=r);break;case"<":case"<=":break;default:throw new Error(`Unexpected operation: ${e.operator}`)}})),!i||t&&!n(t,i)||(t=i)}return t&&e.test(t)?t:null}},731:(e,r,t)=>{const s=t(572),o=t(864),{ANY:n}=o,i=t(215),a=t(654),l=t(396),p=t(571),E=t(424),c=t(65);e.exports=(e,r,t,h)=>{let u,m,$,f,R;switch(e=new s(e,h),r=new i(r,h),t){case">":u=l,m=E,$=p,f=">",R=">=";break;case"<":u=p,m=c,$=l,f="<",R="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(a(e,r,h))return!1;for(let t=0;t<r.set.length;++t){const s=r.set[t];let i=null,a=null;if(s.forEach((e=>{e.semver===n&&(e=new o(">=0.0.0")),i=i||e,a=a||e,u(e.semver,i.semver,h)?i=e:$(e.semver,a.semver,h)&&(a=e)})),i.operator===f||i.operator===R)return!1;if((!a.operator||a.operator===f)&&m(e,a.semver))return!1;if(a.operator===R&&$(e,a.semver))return!1}return!0}},413:(e,r,t)=>{const s=t(654),o=t(344);e.exports=(e,r,t)=>{const n=[];let i=null,a=null;const l=e.sort(((e,r)=>o(e,r,t)));for(const e of l)s(e,r,t)?(a=e,i||(i=e)):(a&&n.push([i,a]),a=null,i=null);i&&n.push([i,null]);const p=[];for(const[e,r]of n)e===r?p.push(e):r||e!==l[0]?r?e===l[0]?p.push(`<=${r}`):p.push(`${e} - ${r}`):p.push(`>=${e}`):p.push("*");const E=p.join(" || "),c="string"==typeof r.raw?r.raw:String(r);return E.length<c.length?E:r}},568:(e,r,t)=>{const s=t(215),o=t(864),{ANY:n}=o,i=t(654),a=t(344),l=[new o(">=0.0.0-0")],p=[new o(">=0.0.0")],E=(e,r,t)=>{if(e===r)return!0;if(1===e.length&&e[0].semver===n){if(1===r.length&&r[0].semver===n)return!0;e=t.includePrerelease?l:p}if(1===r.length&&r[0].semver===n){if(t.includePrerelease)return!0;r=p}const s=new Set;let o,E,u,m,$,f,R;for(const r of e)">"===r.operator||">="===r.operator?o=c(o,r,t):"<"===r.operator||"<="===r.operator?E=h(E,r,t):s.add(r.semver);if(s.size>1)return null;if(o&&E){if(u=a(o.semver,E.semver,t),u>0)return null;if(0===u&&(">="!==o.operator||"<="!==E.operator))return null}for(const e of s){if(o&&!i(e,String(o),t))return null;if(E&&!i(e,String(E),t))return null;for(const s of r)if(!i(e,String(s),t))return!1;return!0}let I=!(!E||t.includePrerelease||!E.semver.prerelease.length)&&E.semver,L=!(!o||t.includePrerelease||!o.semver.prerelease.length)&&o.semver;I&&1===I.prerelease.length&&"<"===E.operator&&0===I.prerelease[0]&&(I=!1);for(const e of r){if(R=R||">"===e.operator||">="===e.operator,f=f||"<"===e.operator||"<="===e.operator,o)if(L&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===L.major&&e.semver.minor===L.minor&&e.semver.patch===L.patch&&(L=!1),">"===e.operator||">="===e.operator){if(m=c(o,e,t),m===e&&m!==o)return!1}else if(">="===o.operator&&!i(o.semver,String(e),t))return!1;if(E)if(I&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===I.major&&e.semver.minor===I.minor&&e.semver.patch===I.patch&&(I=!1),"<"===e.operator||"<="===e.operator){if($=h(E,e,t),$===e&&$!==E)return!1}else if("<="===E.operator&&!i(E.semver,String(e),t))return!1;if(!e.operator&&(E||o)&&0!==u)return!1}return!(o&&f&&!E&&0!==u||E&&R&&!o&&0!==u||L||I)},c=(e,r,t)=>{if(!e)return r;const s=a(e.semver,r.semver,t);return s>0?e:s<0||">"===r.operator&&">="===e.operator?r:e},h=(e,r,t)=>{if(!e)return r;const s=a(e.semver,r.semver,t);return s<0?e:s>0||"<"===r.operator&&"<="===e.operator?r:e};e.exports=(e,r,t={})=>{if(e===r)return!0;e=new s(e,t),r=new s(r,t);let o=!1;e:for(const s of e.set){for(const e of r.set){const r=E(s,e,t);if(o=o||null!==r,r)continue e}if(o)return!1}return!0}},247:(e,r,t)=>{const s=t(215);e.exports=(e,r)=>new s(e,r).set.map((e=>e.map((e=>e.value)).join(" ").trim().split(" ")))},210:(e,r,t)=>{const s=t(215);e.exports=(e,r)=>{try{return new s(e,r).range||"*"}catch(e){return null}}}},r={},function t(s){var o=r[s];if(void 0!==o)return o.exports;var n=r[s]={exports:{}};return e[s](n,n.exports,t),n.exports}(237);var e,r}));