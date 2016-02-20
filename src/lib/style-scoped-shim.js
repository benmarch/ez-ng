/*!
 * <style scoped> shim
 * http://github.com/richtr
 *
 * Copyright 2012 Rich Tibbett
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date: 8th November 2012
 */

/*
 * DESCRIPTION:
 * ------------
 *
 * Javascript shim for <style scoped> elements.
 *
 * Reference specification ->
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#attr-style-scoped
 *
 * Demo page ->
 *
 * http://fiddle.jshell.net/RZ99U/1/show/light/
 *
 * USAGE:
 * ------
 *
 * 1. Add this file anywhere in your web page (outside of any load event handlers):
 *
 * <script type="text/javascript" src="style_scoped_shim.js"></script>
 *
 *
 * 2. Use <style scoped> elements as normal
 *
 * See the test page linked above for a live example.
 *
 */

(function() {

    document.addEventListener('DOMContentLoaded', function() {

        // Don't run if the UA implicitly supports <style scoped>
        var testEl = document.createElement("style");
        if (testEl.scoped !== undefined && testEl.scoped !== null) return;

        var rewriteCSS = function(el) {

            el._scopedStyleApplied = true;

            var elName = "scopedstylewrapper";
            var elId = "s" + (Math.floor(Math.random() * 1e15) + 1);
            var uid = "." + elId;

            // Wrap a custom HTML container around style[scoped]'s parent node
            var container = el.parentNode;
            if(container == document.body) {
                uid = "body"; // scope CSS rules to <body>
            } else {
                var parent = container.parentNode;
                var wrapper = document.createElement(elName);
                wrapper.className = elId;
                parent.replaceChild(wrapper, container);
                wrapper.appendChild(container);
            }

            // Prefix all CSS rules with uid
            var rewrittenCSS = el.textContent.replace(/(((?:(?:[^,{]+),?)*?)\{(?:([^}:]*):?([^};]*);?)*?\};*)/img, uid + " $1");

            // <style scoped> @-directives rules from WHATWG specification

            // Remove added uid prefix from all CSS @-directives commands
            // since we have no way of scoping @-directives yet
            // e.g. .scopingClass @font-face { ... } does not currently work :(
            rewrittenCSS = rewrittenCSS.replace(new RegExp(uid + "\\s+(@[\\w|-]+)" , 'img'), "$1");
            // Remove @global (to make the @global CSS rule work globally)
            rewrittenCSS = rewrittenCSS.replace("@global", "");
            // Ignore @page directives (not allowed in <style scoped>)
            rewrittenCSS = rewrittenCSS.replace("@page", ".notAllowedInScopedCSS @page");

            el.textContent = rewrittenCSS;
        };

        var extractScopedStyles = function( root ) {
            // Obtain style[scoped] elements from page
            if(root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)
                return;
            var els = root.querySelectorAll('style[scoped]');
            for (var i = 0, l = els.length; i < l; i++) {
                if(!els[i]._scopedStyleApplied)
                    rewriteCSS(els[i]);
            }
        };

        // Process scoped stylesheets from current page
        extractScopedStyles(document);

        // Listen for scoped stylesheet injection
        document.addEventListener('DOMNodeInserted', function(e) {
            var el = e.target;
            if (el.tagName === "STYLE" && (el.getAttribute("scoped") !== undefined &&
                el.getAttribute("scoped") !== null) && !el._scopedStyleApplied) {
                rewriteCSS(el);
            }
            // Process nested style[scope] elements (if any)
            extractScopedStyles(el);
        }, false);

    }, false);

}());
