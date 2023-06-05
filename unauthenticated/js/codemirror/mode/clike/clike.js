!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){function t(e,t,n,r,o,i){this.indented=e,this.column=t,this.type=n,this.info=r,this.align=o,this.prev=i}function n(e,n,r,o){var i=e.indented;return e.context&&"statement"==e.context.type&&"statement"!=r&&(i=e.context.indented),e.context=new t(i,n,r,o,null,e.context)}function r(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}function o(e,t,n){if("variable"==t.prevToken||"type"==t.prevToken||/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(e.string.slice(0,n))||t.typeAtEndOfLine&&e.column()==e.indentation())return!0}function i(e){for(;;){if(!e||"top"==e.type)return!0;if("}"==e.type&&"namespace"!=e.prev.info)return!1;e=e.prev}}function a(e){var t={};e=e.split(" ");for(var n=0;n<e.length;++n)t[e[n]]=!0;return t}function l(e,t){return"function"==typeof e?e(t):e.propertyIsEnumerable(t)}function s(e){return l(k,e)||/.+_t$/.test(e)}function c(e){return s(e)||l(w,e)}function u(e,t){if(!t.startOfLine)return!1;for(var n,r=null;n=e.peek();){if("\\"==n&&e.match(/^.$/)){r=u;break}if("/"==n&&e.match(/^\/[\/\*]/,!1))break;e.next()}return t.tokenize=r,"meta"}function d(e,t){return"type"==t.prevToken&&"type"}function f(e){return!(!e||2>e.length||"_"!=e[0]||"_"!=e[1]&&e[1]===e[1].toLowerCase())}function p(e){return e.eatWhile(/[\w\.']/),"number"}function m(e,t){if(e.backUp(1),e.match(/^(?:R|u8R|uR|UR|LR)/)){var n=e.match(/^"([^\s\\()]{0,16})\(/);return!!n&&(t.cpp11RawStringDelim=n[1],t.tokenize=g,g(e,t))}return e.match(/^(?:u8|u|U|L)/)?!!e.match(/^["']/,!1)&&"string":(e.next(),!1)}function h(e){return(e=/(\w+)::~?(\w+)$/.exec(e))&&e[1]==e[2]}function y(e,t){for(var n;null!=(n=e.next());)if('"'==n&&!e.eat('"')){t.tokenize=null;break}return"string"}function g(e,t){var n=t.cpp11RawStringDelim.replace(/[^\w\s]/g,"\\$&");return e.match(new RegExp(".*?\\)"+n+'"'))?t.tokenize=null:e.skipToEnd(),"string"}function _(t,n){function r(e){if(e)for(var t in e)e.hasOwnProperty(t)&&o.push(t)}"string"==typeof t&&(t=[t]);var o=[];r(n.keywords),r(n.types),r(n.builtin),r(n.atoms),o.length&&(n.helperType=t[0],e.registerHelper("hintWords",t[0],o));for(var i=0;i<t.length;++i)e.defineMIME(t[i],n)}function b(e,t){for(var n=!1;!e.eol();){if(!n&&e.match('"""')){t.tokenize=null;break}n="\\"==e.next()&&!n}return"string"}function x(e){return function(t,n){for(var r;r=t.next();){if("*"==r&&t.eat("/")){if(1==e){n.tokenize=null;break}return n.tokenize=x(e-1),n.tokenize(t,n)}if("/"==r&&t.eat("*"))return n.tokenize=x(e+1),n.tokenize(t,n)}return"comment"}}e.defineMode("clike",function(a,s){function c(e,t){var n=e.next();if(v[n]){var r=v[n](e,t);if(!1!==r)return r}if('"'==n||"'"==n)return t.tokenize=function(e){return function(t,n){for(var r,o=!1,i=!1;null!=(r=t.next());){if(r==e&&!o){i=!0;break}o=!o&&"\\"==r}return(i||!o&&!S)&&(n.tokenize=null),"string"}}(n),t.tokenize(e,t);if(E.test(n)){if(e.backUp(1),e.match(C))return"number";e.next()}if(I.test(n))return f=n,null;if("/"==n){if(e.eat("*"))return t.tokenize=u,u(e,t);if(e.eat("/"))return e.skipToEnd(),"comment"}if(M.test(n)){for(;!e.match(/^\/[\/*]/,!1)&&e.eat(M););return"operator"}if(e.eatWhile(L),T)for(;e.match(T);)e.eatWhile(L);return n=e.current(),l(g,n)?(l(x,n)&&(f="newstatement"),l(k,n)&&(p=!0),"keyword"):l(_,n)?"type":l(b,n)||D&&D(n)?(l(x,n)&&(f="newstatement"),"builtin"):l(w,n)?"atom":"variable"}function u(e,t){for(var n,r=!1;n=e.next();){if("/"==n&&r){t.tokenize=null;break}r="*"==n}return"comment"}function d(e,t){s.typeFirstDefinitions&&e.eol()&&i(t.context)&&(t.typeAtEndOfLine=o(e,t,e.pos))}var f,p,m=a.indentUnit,h=s.statementIndentUnit||m,y=s.dontAlignCalls,g=s.keywords||{},_=s.types||{},b=s.builtin||{},x=s.blockKeywords||{},k=s.defKeywords||{},w=s.atoms||{},v=s.hooks||{},S=s.multiLineStrings,N=!1!==s.indentStatements,T=s.namespaceSeparator,I=s.isPunctuationChar||/[\[\]{}\(\),;:\.]/,E=s.numberStart||/[\d\.]/,C=s.number||/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,M=s.isOperatorChar||/[+\-*&%=<>!?|\/]/,L=s.isIdentifierChar||/[\w\$_\xa1-\uffff]/,D=s.isReservedIdentifier||!1;return{startState:function(e){return{tokenize:null,context:new t((e||0)-m,0,"top",null,!1),indented:0,startOfLine:!0,prevToken:null}},token:function(e,t){var a=t.context;if(e.sol()&&(null==a.align&&(a.align=!1),t.indented=e.indentation(),t.startOfLine=!0),e.eatSpace())return d(e,t),null;f=p=null;var l=(t.tokenize||c)(e,t);if("comment"==l||"meta"==l)return l;if(null==a.align&&(a.align=!0),";"==f||":"==f||","==f&&e.match(/^\s*(?:\/\/.*)?$/,!1))for(;"statement"==t.context.type;)r(t);else if("{"==f)n(t,e.column(),"}");else if("["==f)n(t,e.column(),"]");else if("("==f)n(t,e.column(),")");else if("}"==f){for(;"statement"==a.type;)a=r(t);for("}"==a.type&&(a=r(t));"statement"==a.type;)a=r(t)}else f==a.type?r(t):N&&(("}"==a.type||"top"==a.type)&&";"!=f||"statement"==a.type&&"newstatement"==f)&&n(t,e.column(),"statement",e.current());return"variable"==l&&("def"==t.prevToken||s.typeFirstDefinitions&&o(e,t,e.start)&&i(t.context)&&e.match(/^\s*\(/,!1))&&(l="def"),v.token&&void 0!==(a=v.token(e,t,l))&&(l=a),"def"==l&&!1===s.styleDefs&&(l="variable"),t.startOfLine=!1,t.prevToken=p?"def":l||f,d(e,t),l},indent:function(t,n){if(t.tokenize!=c&&null!=t.tokenize||t.typeAtEndOfLine)return e.Pass;var r=t.context,o=n&&n.charAt(0),i=o==r.type;if("statement"==r.type&&"}"==o&&(r=r.prev),s.dontIndentStatements)for(;"statement"==r.type&&s.dontIndentStatements.test(r.info);)r=r.prev;if(v.indent){var a=v.indent(t,r,n,m);if("number"==typeof a)return a}if(a=r.prev&&"switch"==r.prev.info,s.allmanIndentation&&/[{(]/.test(o)){for(;"top"!=r.type&&"}"!=r.type;)r=r.prev;return r.indented}return"statement"==r.type?r.indented+("{"==o?0:h):!r.align||y&&")"==r.type?")"!=r.type||i?r.indented+(i?0:m)+(i||!a||/^(?:case|default)\b/.test(n)?0:m):r.indented+h:r.column+(i?0:1)},electricInput:!1!==s.indentSwitch?/^\s*(?:case .*?:|default:|\{\}?|\})$/:/^\s*[{}]$/,blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",lineComment:"//",fold:"brace"}});var k=a("int long char short double float unsigned signed void bool"),w=a("SEL instancetype id Class Protocol BOOL");_(["text/x-csrc","text/x-c","text/x-chdr"],{name:"clike",keywords:a("auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran"),types:s,blockKeywords:a("case do else for if switch while struct enum union"),defKeywords:a("struct enum union"),typeFirstDefinitions:!0,atoms:a("NULL true false"),isReservedIdentifier:f,hooks:{"#":u,"*":d},modeProps:{fold:["brace","include"]}}),_(["text/x-c++src","text/x-c++hdr"],{name:"clike",keywords:a("auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq"),types:s,blockKeywords:a("case do else for if switch while struct enum union class try catch"),defKeywords:a("struct enum union class namespace"),typeFirstDefinitions:!0,atoms:a("true false NULL nullptr"),dontIndentStatements:/^template$/,isIdentifierChar:/[\w\$_~\xa1-\uffff]/,isReservedIdentifier:f,hooks:{"#":u,"*":d,u:m,U:m,L:m,R:m,0:p,1:p,2:p,3:p,4:p,5:p,6:p,7:p,8:p,9:p,token:function(e,t,n){if("variable"==n&&"("==e.peek()&&(";"==t.prevToken||null==t.prevToken||"}"==t.prevToken)&&h(e.current()))return"def"}},namespaceSeparator:"::",modeProps:{fold:["brace","include"]}}),_("text/x-java",{name:"clike",keywords:a("abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package private protected public return static strictfp super switch synchronized this throw throws transient try volatile while @interface"),types:a("var byte short int long float double boolean char void Boolean Byte Character Double Float Integer Long Number Object Short String StringBuffer StringBuilder Void"),blockKeywords:a("catch class do else finally for if switch try while"),defKeywords:a("class interface enum @interface"),typeFirstDefinitions:!0,atoms:a("true false null"),number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,hooks:{"@":function(e){return!e.match("interface",!1)&&(e.eatWhile(/[\w\$_]/),"meta")},'"':function(e,t){return!!e.match(/""$/)&&(t.tokenize=b,t.tokenize(e,t))}},modeProps:{fold:["brace","import"]}}),_("text/x-csharp",{name:"clike",keywords:a("abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in init interface internal is lock namespace new operator out override params private protected public readonly record ref required return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield"),types:a("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong"),blockKeywords:a("catch class do else finally for foreach if struct switch try while"),defKeywords:a("class interface namespace record struct var"),typeFirstDefinitions:!0,atoms:a("true false null"),hooks:{"@":function(e,t){return e.eat('"')?(t.tokenize=y,y(e,t)):(e.eatWhile(/[\w\$_]/),"meta")}}}),_("text/x-scala",{name:"clike",keywords:a("abstract case catch class def do else extends final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try type val var while with yield _ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble"),types:a("AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"),multiLineStrings:!0,blockKeywords:a("catch class enum do else finally for forSome if match switch try while"),defKeywords:a("class enum def object package trait type val var"),atoms:a("true false null"),indentStatements:!1,indentSwitch:!1,isOperatorChar:/[+\-*&%=<>!?|\/#:@]/,hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},'"':function(e,t){return!!e.match('""')&&(t.tokenize=b,t.tokenize(e,t))},"'":function(e){return e.match(/^(\\[^'\s]+|[^\\'])'/)?"string-2":(e.eatWhile(/[\w\$_\xa1-\uffff]/),"atom")},"=":function(e,n){var r=n.context;return!("}"!=r.type||!r.align||!e.eat(">"))&&(n.context=new t(r.indented,r.column,r.type,r.info,null,r.prev),"operator")},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=x(1),t.tokenize(e,t))}},modeProps:{closeBrackets:{pairs:'()[]{}""',triples:'"'}}}),_("text/x-kotlin",{name:"clike",keywords:a("package as typealias class interface this super val operator var fun for is in This throw return annotation break continue object if else while do try when !in !is as? file import where by get set abstract enum open inner override private public internal protected catch finally out final vararg reified dynamic companion constructor init sealed field property receiver param sparam lateinit data inline noinline tailrec external annotation crossinline const operator infix suspend actual expect setparam value"),types:a("Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy LazyThreadSafetyMode LongArray Nothing ShortArray Unit"),intendSwitch:!1,indentStatements:!1,multiLineStrings:!0,number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,blockKeywords:a("catch class do else finally for if where try while enum"),defKeywords:a("class val var object interface fun"),atoms:a("true false null this"),hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},"*":function(e,t){return"."==t.prevToken?"variable":"operator"},'"':function(e,t){return t.tokenize=function(e){return function(t,n){for(var r,o=!1,i=!1;!t.eol();){if(!e&&!o&&t.match('"')){i=!0;break}if(e&&t.match('"""')){i=!0;break}r=t.next(),!o&&"$"==r&&t.match("{")&&t.skipTo("}"),o=!o&&"\\"==r&&!e}return!i&&e||(n.tokenize=null),"string"}}(e.match('""')),t.tokenize(e,t)},"/":function(e,t){return!!e.eat("*")&&(t.tokenize=x(1),t.tokenize(e,t))},indent:function(e,t,n,r){var o=n&&n.charAt(0);return"}"!=e.prevToken&&")"!=e.prevToken||""!=n?"operator"==e.prevToken&&"}"!=n&&"}"!=e.context.type||"variable"==e.prevToken&&"."==o||("}"==e.prevToken||")"==e.prevToken)&&"."==o?2*r+t.indented:t.align&&"}"==t.type?t.indented+(e.context.type==(n||"").charAt(0)?0:r):void 0:e.indented}},modeProps:{closeBrackets:{triples:'"'}}}),_(["x-shader/x-vertex","x-shader/x-fragment"],{name:"clike",keywords:a("sampler1D sampler2D sampler3D samplerCube sampler1DShadow sampler2DShadow const attribute uniform varying break continue discard return for while do if else struct in out inout"),types:a("float int bool void vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 mat2 mat3 mat4"),blockKeywords:a("for while do if else struct"),builtin:a("radians degrees sin cos tan asin acos atan pow exp log exp2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize ftransform faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not texture1D texture1DProj texture1DLod texture1DProjLod texture2D texture2DProj texture2DLod texture2DProjLod texture3D texture3DProj texture3DLod texture3DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod dFdx dFdy fwidth noise1 noise2 noise3 noise4"),atoms:a("true false gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_FogCoord gl_PointCoord gl_Position gl_PointSize gl_ClipVertex gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor gl_TexCoord gl_FogFragCoord gl_FragCoord gl_FrontFacing gl_FragData gl_FragDepth gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose gl_ProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixInverseTranspose gl_TextureMatrixInverseTranspose gl_NormalScale gl_DepthRange gl_ClipPlane gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel gl_FrontLightModelProduct gl_BackLightModelProduct gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ gl_FogParameters gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits gl_MaxDrawBuffers"),indentSwitch:!1,hooks:{"#":u},modeProps:{fold:["brace","include"]}}),_("text/x-nesc",{name:"clike",keywords:a("auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran as atomic async call command component components configuration event generic implementation includes interface module new norace nx_struct nx_union post provides signal task uses abstract extends"),types:s,blockKeywords:a("case do else for if switch while struct enum union"),atoms:a("null true false"),hooks:{"#":u},modeProps:{fold:["brace","include"]}}),_("text/x-objectivec",{name:"clike",keywords:a("auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available"),types:c,builtin:a("FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT"),blockKeywords:a("case do else for if switch while struct enum union @synthesize @try @catch @finally @autoreleasepool @synchronized"),defKeywords:a("struct enum union @interface @implementation @protocol @class"),dontIndentStatements:/^@.*$/,typeFirstDefinitions:!0,atoms:a("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:f,hooks:{"#":u,"*":d},modeProps:{fold:["brace","include"]}}),_("text/x-objectivec++",{name:"clike",keywords:a("auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq"),types:c,builtin:a("FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT"),blockKeywords:a("case do else for if switch while struct enum union @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),defKeywords:a("struct enum union @interface @implementation @protocol @class class namespace"),dontIndentStatements:/^@.*$|^template$/,typeFirstDefinitions:!0,atoms:a("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:f,hooks:{"#":u,"*":d,u:m,U:m,L:m,R:m,0:p,1:p,2:p,3:p,4:p,5:p,6:p,7:p,8:p,9:p,token:function(e,t,n){if("variable"==n&&"("==e.peek()&&(";"==t.prevToken||null==t.prevToken||"}"==t.prevToken)&&h(e.current()))return"def"}},namespaceSeparator:"::",modeProps:{fold:["brace","include"]}}),_("text/x-squirrel",{name:"clike",keywords:a("base break clone continue const default delete enum extends function in class foreach local resume return this throw typeof yield constructor instanceof static"),types:s,blockKeywords:a("case catch class else for foreach if switch try while"),defKeywords:a("function local class"),typeFirstDefinitions:!0,atoms:a("true false null"),hooks:{"#":u},modeProps:{fold:["brace","include"]}});var v=null;_("text/x-ceylon",{name:"clike",keywords:a("abstracts alias assembly assert assign break case catch class continue dynamic else exists extends finally for function given if import in interface is let module new nonempty object of out outer package return satisfies super switch then this throw try value void while"),types:function(e){return(e=e.charAt(0))===e.toUpperCase()&&e!==e.toLowerCase()},blockKeywords:a("case catch class dynamic else finally for function if interface module new object switch try while"),defKeywords:a("class dynamic function interface module object package value"),builtin:a("abstract actual aliased annotation by default deprecated doc final formal late license native optional sealed see serializable shared suppressWarnings tagged throws variable"),isPunctuationChar:/[\[\]{}\(\),;:\.`]/,isOperatorChar:/[+\-*&%=<>!?|^~:\/]/,numberStart:/[\d#$]/,number:/^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,multiLineStrings:!0,typeFirstDefinitions:!0,atoms:a("true false null larger smaller equal empty finished"),indentSwitch:!1,styleDefs:!1,hooks:{"@":function(e){return e.eatWhile(/[\w\$_]/),"meta"},'"':function(e,t){return t.tokenize=function e(t){return function(n,r){for(var o,i=!1,a=!1;!n.eol();){if(!i&&n.match('"')&&("single"==t||n.match('""'))){a=!0;break}if(!i&&n.match("``")){v=e(t),a=!0;break}o=n.next(),i="single"==t&&!i&&"\\"==o}return a&&(r.tokenize=null),"string"}}(e.match('""')?"triple":"single"),t.tokenize(e,t)},"`":function(e,t){return!(!v||!e.match("`"))&&(t.tokenize=v,v=null,t.tokenize(e,t))},"'":function(e){return e.eatWhile(/[\w\$_\xa1-\uffff]/),"atom"},token:function(e,t,n){if(("variable"==n||"type"==n)&&"."==t.prevToken)return"variable-2"}},modeProps:{fold:["brace","import"],closeBrackets:{triples:'"'}}})});