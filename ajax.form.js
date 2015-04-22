/*
author:Cheemi
blog url:http://cheemi.com
*/
(function (window, document, undefined) {
    var json_parse = (function () { var K, F, J = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" }, H, D = function (N) { throw { name: "SyntaxError", message: N, at: K, text: H } }, M = function (N) { if (N && N !== F) { D("Expected '" + N + "' instead of '" + F + "'") } F = H.charAt(K); K += 1; return F }, A = function () { var O, N = ""; if (F === "-") { N = "-"; M("-") } while (F >= "0" && F <= "9") { N += F; M() } if (F === ".") { N += "."; while (M() && F >= "0" && F <= "9") { N += F } } if (F === "e" || F === "E") { N += F; M(); if (F === "-" || F === "+") { N += F; M() } while (F >= "0" && F <= "9") { N += F; M() } } O = +N; if (!isFinite(O)) { D("Bad number") } else { return O } }, G = function () { var P, N, O = "", Q; if (F === '"') { while (M()) { if (F === '"') { M(); return O } if (F === "\\") { M(); if (F === "u") { Q = 0; for (N = 0; N < 4; N += 1) { P = parseInt(M(), 16); if (!isFinite(P)) { break } Q = Q * 16 + P } O += String.fromCharCode(Q) } else { if (typeof J[F] === "string") { O += J[F] } else { break } } } else { O += F } } } D("Bad string") }, L = function () { while (F && F <= " ") { M() } }, E = function () { switch (F) { case "t": M("t"); M("r"); M("u"); M("e"); return true; case "f": M("f"); M("a"); M("l"); M("s"); M("e"); return false; case "n": M("n"); M("u"); M("l"); M("l"); return null } D("Unexpected '" + F + "'") }, C, B = function () { var N = []; if (F === "[") { M("["); L(); if (F === "]") { M("]"); return N } while (F) { N.push(C()); L(); if (F === "]") { M("]"); return N } M(","); L() } } D("Bad array") }, I = function () { var N, O = {}; if (F === "{") { M("{"); L(); if (F === "}") { M("}"); return O } while (F) { N = G(); L(); M(":"); if (Object.hasOwnProperty.call(O, N)) { D('Duplicate key "' + N + '"') } O[N] = C(); L(); if (F === "}") { M("}"); return O } M(","); L() } } D("Bad object") }; C = function () { L(); switch (F) { case "{": return I(); case "[": return B(); case '"': return G(); case "-": return A(); default: return F >= "0" && F <= "9" ? A() : E() } }; return function (N, Q) { var P; H = N; K = 0; F = " "; P = C(); L(); if (F) { D("Syntax error") } return typeof Q === "function" ? (function O(U, S) { var V, T, R = U[S]; if (R && typeof R === "object") { for (V in R) { if (Object.prototype.hasOwnProperty.call(R, V)) { T = O(R, V); if (T !== undefined) { R[V] = T } else { delete R[V] } } } } return Q.call(U, S, R) }({ "": P }, "")) : P } }());
    var ajax = function (_config) {
        var xmlHttp = new ajax.createXHR();

        var config = {
            method: "get",
            url: "",
            par: "",
            async: true,
            contentType: "application/x-www-form-urlencoded",
            formElement: null,
            onLoading: null,
            onComplete: null,
            onSuccess: null,
            onError: null
        };
        for (var par in _config) {
            config[par] = _config[par];
        }
        if (config.formElement != null) {
            if (typeof config.method == "undefined") {
                if (config.formElement.getAttribute("method")) {
                    config.method = config.formElement.getAttribute("method");
                }
            }
            if (typeof config.url == "undefined" || config.url.length < 1) {

                if (config.formElement.getAttribute("action")) {
                    config.url = config.formElement.getAttribute("action");

                }
            }
            
            config.par = ajax.getFormString(config.formElement);
        } else {
           
            config.par = encodeURI(config.par);
        }
      
        config.url += (config.url.indexOf("?") > -1 ? "&" : "?") + "now=" + new Date().getTime();
        if (config.method == "get") {
            if (config.par != "") {
                config.url += "&" + config.par;
            }
        }

        xmlHttp.open(config.method, config.url, config.async);
        xmlHttp.onreadystatechange = function () {

            if (xmlHttp.readyState == 1) {
                if (config.onLoading) {
                    config.onLoading(xmlHttp);
                }
            }
            if (xmlHttp.readyState == 4) {
                if (config.onComplete) {
                    config.onComplete(xmlHttp);
                }
                if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304) {
                    if (config.onSuccess) {
                        //如果是json格式的则返回json对象
                        if (config.contentType.toLowerCase() == "json") {
                            myData = json_parse(xmlHttp.responseText, function (key, value) {
                                var a;
                                if (typeof value === 'string') {
                                    a =
                /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                                    if (a) {
                                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                                            +a[5], +a[6]));
                                    }
                                }
                                return value;
                            });
                            config.onSuccess(myData, xmlHttp);
                        } else {
                            config.onSuccess(xmlHttp.responseText, xmlHttp);
                        }
                    }
                }
                else {
                    if (config.onError) {
                        config.onError(xmlHttp);
                    }
                }
            }
        }
        if (xmlHttp.method == "get") {
            xmlHttp.send(null);
        }
        else {
            xmlHttp.setRequestHeader("Content-Type", config.contentType);
            xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlHttp.send(config.par);
        }
    };
    ajax.createXHR = function () {
        if (typeof XMLHttpRequest != "undefined") {
            ajax.createXHR = function () {
                return new XMLHttpRequest();
            }
        } else if (typeof ActiveXObject != "undefined") {
            var ver = [function () { return new ActiveXObject("MSXML2.XmlHttp.6.0"); },
                function () { return new ActiveXObject("MSXML2.XmlHttp.3.0"); },
                function () { return new ActiveXObject("MSXML2.XmlHttp"); }
            ];

            for (var i = 0; i < ver.length; i++) {
                try {

                    ajax.createXHR = new ver[i]();
                    break;
                } catch (e) {

                }
            }
        }
        else ajax.createXHR = function () {
            throw new Error("No XHR object available.");
        }
        return new ajax.createXHR();
    };
    ajax.getFormString = function (formElement) {
        var str = "", and = "";
        var el;
        var elValue;

        for (var i = 0; i < formElement.length; i++) {
            el = formElement[i];
            if (el.name != "") {
                if (el.type == "select-one") {
                    elValue = el.options[el.selectedIndex].value;
                }
                else if (el.type == "checkbox" || el.type == "radio") {
                    if (el.checked == false) {
                        continue;
                    }

                    elValue = el.value;
                }
                else if (el.type == "button" || el.type == "submit" || el.type == "reset" || el.type == "image") {
                    continue;
                } else {

                    elValue = el.value;
                }
                elValue = encodeURIComponent(elValue);

                str += and + el.name + "=" + elValue;
                and = "&";
            }

        }
        return str;
    }
    //对外部提供调用接口
    window["ajax"] = ajax;

})(window, document);
