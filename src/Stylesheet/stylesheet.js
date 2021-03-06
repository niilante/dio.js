/**
 * css preprocessor
 *
 * @example stylesheet('.foo', 'css...', true, true, null);
 * 
 * @param  {string}   selector   - i.e `.class` or `#id` or `[attr=id]`
 * @param  {string}   styles     - css string
 * @param  {boolean=} animations - prefix animations and keyframes, true by default
 * @param  {boolean=} compact    - enable additional features(mixins and variables)
 * @param  {function(context, content, line, column)=} middleware
 * @return {string}
 */
function stylesheet (selector, styles, animations, compact, middleware) {
    // to string
    selector += '';

    var prefix = '';
    var namespace = '';
    var type = selector.charCodeAt(0) || 0;
    
    var char;
    var attr;
    var animns;
    var plugins;
    var uses;

    // [ attr selector
    if (type === 91) {
        // `[data-id=namespace]` -> ['data-id', 'namespace']
        attr = selector.substring(1, selector.length-1).split('=');
        char = (namespace = attr[1]).charCodeAt(0);

        // [data-id="namespace"]/[data-id='namespace']
        // --> "namespace"/'namspace' --> namespace
        if (char === 34 || char === 39) {
            namespace = namespace.substring(1, namespace.length-1);
        }

        prefix = '['+ attr[0] + '="' + namespace +'"]';
    }
    // `#` `.` `>` id class and descendant selectors
    else if (type === 35 || type === 46 || type === 62) {
        namespace = (prefix = selector).substring(1);
    }
    // element selector
    else {
        namespace = prefix = selector;
    }

    // reset type signature
    type = 0;

    // animation and keyframe namespace
    if (animations == void 0 || animations === true) {
        animations = true;
        animns = namespace;
    }
    else {
        animns = '';
        animations = false;
    }

    // uses middleware
    var use = middleware != null;

    // middleware
    if (use) {
        uses = (typeof middleware).charCodeAt(0);

        // o, object of middlewares
        if (uses === 111) {
            stylesheet.use(middleware, null);
        }
        // f, not a single function middleware
        else if (uses !== 102) {
            use = false;
        }
    }

    // plugins
    if ((plugins = stylesheet.plugins).length !== 0) {
        middleware = function (ctx, str, line, col) {
            var output = str;

            for (var i = 0, length = plugins.length; i < length; i++) {
                output = plugins[i](ctx, output, line, col) || output;
            }

            return output !== str ? output : void 0;
        };

        use = true;
    }

    // declare
    var colon;
    var inner;
    var selectors;
    var build;
    var media;
    var temp;
    var prev;
    var indexOf;
    var first;
    var second;
    var third;
    var sel;

    // variables
    var variables;

    // mixins
    var mixins;
    var mixin;

    // buffers
    var buff = '';
    var blob = '';
    var blck = '';
    var nest = '';
    var flat = '';
    var code = 0;

    // context signatures       
    var special = 0;
    var close = 0;
    var closed = 0;
    var comment = 0;
    var comments = 0;
    var strings = 0;
    var nested = 0;
    var func = 0;

    // context(flat) signatures
    var levels = 0;
    var level = 0;

    // prefixes
    var moz = '-moz-';
    var ms = '-ms-';
    var webkit = '-webkit-';

    if (use) {
        temp = middleware(0, styles, line, column);
        
        if (temp != null) {
            styles = temp;
        }
    }

    // positions
    var caret = 0;
    var depth = 0;
    var column = 0;
    var line = 1;
    var eof = styles.length;

    // compiled output
    var output = '';

    // parse + compile
    while (caret < eof) {
        code = styles.charCodeAt(caret);

        // {, }, ; characters, parse line by line
        if (strings === 0 && func === 0 && (code === 123 || code === 125 || code === 59)) {
            buff += styles.charAt(caret);

            first = buff.charCodeAt(0);

            // only trim when the first character is a space ` `
            if (first === 32) {
                first = (buff = buff.trim()).charCodeAt(0);
            }

            // default to 0 instead of NaN if there is no second/third character
            second = buff.charCodeAt(1) || 0;
            third = buff.charCodeAt(2) || 0;

            // middleware, selector/property context, }
            if (use && code !== 125) {
                // { selector context
                if (code === 123) {
                    temp = middleware(1, buff.substring(0, buff.length - 1).trim(), line, column);
                } 
                // ; property context
                else {
                    temp = middleware(2, buff, line, column);
                }

                if (temp != null) {
                    buff = code === 123 ? temp + '{' : temp;
                }
            }

            // ignore comments
            if (comment === 2) {
                if (code === 125) {
                    comment = 0;
                }
                buff = ''; 
            }
            // @, special block
            else if (first === 64) {
                // push flat css
                if (levels === 1 && flat.length !== 0) {
                    levels = 0;
                    flat = prefix + ' {' + flat + '}';

                    // middleware, flat context
                    if (use) {
                        temp = middleware(4, flat, line, column);
                    
                        if (temp != null) {
                            flat = temp;
                        }
                    }

                    output += flat;
                    flat = '';
                }

                // @keyframe/@global, `k` or @global, `g` character
                if (second === 107 || second === 103) {
                    // k, @keyframes
                    if (second === 107) {
                        blob = buff.substring(1, 11) + animns + buff.substring(11);
                        buff = '@'+webkit+blob;
                        type = 1;
                    }
                    // g, @global
                    else {
                        buff = '';
                    }
                }
                // @media/@mixin `m` character
                else if (second === 109) {
                    // @mixin
                    if (compact === true && third === 105) {
                        // first match create mixin store
                        mixins === void 0 && (mixins = {});

                        // retrieve mixin identifier
                        blob = (mixin = buff.substring(7, buff.indexOf('{')) + ' ').trim();

                        // cache current mixin name
                        mixin = mixin.substring(0, mixin.indexOf(' ')).trim();

                        // append mixin identifier
                        mixins[mixin] = {key: blob.trim(), body: ''};

                        type = 3;
                        buff = '';
                        blob = '';
                    }
                    // @media
                    else if (third === 101) {
                        // nested
                        if (depth !== 0) {
                            // discard first character {
                            caret++;
                            
                            media = '';
                            inner = '';
                            selectors = prev.split(',');

                            // keep track of opening `{` and `}` occurrences
                            closed = 1;

                            // travel to the end of the block
                            while (caret < eof) {
                                char = styles.charCodeAt(caret);

                                // {, }, nested blocks may have nested blocks
                                if (char === 123) {
                                    closed++;
                                }
                                else if (char === 125) {
                                    closed--;
                                }

                                // break when the nested block has ended
                                if (closed === 0) {
                                    break;
                                }

                                // build content of nested block
                                inner += styles.charAt(caret++);
                            }

                            for (var i = 0, length = selectors.length; i < length; i++) {
                                selector = selectors[i];

                                // build media block
                                media += stylesheet(
                                    // remove { on last selector
                                    (i === length - 1 ? selector.substring(0, selector.length - 1) :  selector).trim(),
                                    inner, 
                                    animations, 
                                    compact, 
                                    middleware
                                );
                            }

                            media = buff + media + '}';
                            buff = '';
                            type = 4;
                        }
                        // top-level
                        else {
                            type = 2;
                        }
                    }
                    // unknown
                    else {
                        type = 6;
                    }
                }

                // @include/@import `i` character
                if (second === 105) {
                    // @include `n` character
                    if (compact === true && third === 110) {
                        buff = buff.substring(9, buff.length - 1);
                        indexOf = buff.indexOf('(');

                        // function mixins
                        if (indexOf !== -1) {
                            // mixin name
                            var name = buff.substring(0, indexOf);

                            // mixin data
                            var data = mixins[name];

                            // args passed to the mixin
                            var argsPassed = buff.substring(name.length+1, buff.length - 1).split(',');

                            // args the mixin expects
                            var argsExpected = data.key.replace(name, '').replace(/\(|\)/g, '').trim().split(',');
                            
                            buff = data.body;

                            for (var i = 0, length = argsPassed.length; i < length; i++) {
                                var arg = argsExpected[i].trim();

                                // if the mixin has a slot for that arg
                                if (arg !== void 0) {
                                    buff = buff.replace(new RegExp('var\\(~~'+arg+'\\)', 'g'), argsPassed[i].trim());
                                }
                            }

                            // create block and update styles length
                            styles += buff;
                            eof += buff.length;

                            // reset
                            buff = '';
                        }
                        // static mixins
                        else {
                            buff = mixins[buff].body;

                            if (depth === 0) {
                                // create block and update styles length
                                styles += buff;
                                eof += buff.length;

                                // reset
                                buff = '';
                            }
                        }
                    }
                    // @import `m` character
                    else if (third === 109 && use) {
                        // avoid "foo.css"; "foo" screen; "http://foo.com/bar"; url(foo);
                        var match = /@import.*?(["'`][^\.\n\r]*?["'`];|["'`][^:\r\n]*?\.[^c].*?["'`])/g.exec(buff);

                        if (match !== null) {
                            // middleware, import context
                            buff = middleware(5, match[1].replace(/['"; ]/g, ''), line, column) || '';

                            if (buff) {
                                // create block and update styles length
                                styles = styles.substring(0, caret+1) + buff + styles.substring(caret+1);
                                eof += buff.length;
                            }

                            buff = '';
                        }
                    }
                }
                // flag special, i.e @keyframes, @global
                else if (type !== 4) {
                    close = -1;
                    special++;
                }
            }
            // ~, ; variables
            else if (compact === true && code === 59 && first === 126 && second === 126) {
                colon = buff.indexOf(':');

                // first match create variables store 
                if (variables === void 0) {
                    variables = [];
                }

                // push key value pair
                variables[variables.length] = [buff.substring(0, colon), buff.substring(colon+1, buff.length - 1).trim()];

                // reset buffer
                buff = '';
            }
            // property/selector
            else {
                // animation: a, n, i characters
                if (first === 97 && second === 110 && third === 105) {
                    // removes ;
                    buff = buff.substring(0, buff.length - 1);

                    // position of :
                    colon = buff.indexOf(':')+1;

                    // left hand side everything before `:`
                    build = buff.substring(0, colon);

                    // right hand side everything after `:` /* @type string[] */
                    var anims = buff.substring(colon).trim().split(',');

                    // - short hand animation syntax
                    if (animations === true && (buff.charCodeAt(9) || 0) !== 45) {
                        // because we can have multiple animations `animation: slide 4s, slideOut 2s`
                        for (var j = 0, length = anims.length; j < length; j++) {
                            var anim = anims[j];
                            var props = anim.split(' ');

                            // since we can't be sure of the position of the name of the animation we have to find it
                            for (var k = 0, l = props.length; k < l; k++) {
                                var prop = props[k].trim();
                                var frst = prop.charCodeAt(0);
                                var thrd = prop.charCodeAt(2);
                                var len = prop.length;
                                var last = prop.charCodeAt(len - 1);

                                // animation name is anything not in this list
                                if (
                                    // cubic-bezier()/steps(), ) 
                                    last !== 41 && len !== 0 &&

                                    // infinite, i, f, e
                                    !(frst === 105 && thrd === 102 && last === 101 && len === 8) &&

                                    // linear, l, n, r
                                    !(frst === 108 && thrd === 110 && last === 114 && len === 6) &&

                                    // alternate/alternate-reverse, a, t, e
                                    !(frst === 97 && thrd === 116 && last === 101 && (len === 9 || len === 17)) &&

                                    // normal, n, r, l
                                    !(frst === 110 && thrd === 114 && last === 108 && len === 6) &&

                                    // backwards, b, c, s
                                    !(frst === 98 && thrd === 99 && last === 115 && len === 9) &&

                                    // forwards, f, r, s
                                    !(frst === 102 && thrd === 114 && last === 115 && len === 8) &&

                                    // both, b, t, h
                                    !(frst === 98 && thrd === 116 && last === 104 && len === 4) &&

                                    // none, n, n, e
                                    !(frst === 110 && thrd === 110 && last === 101 && len === 4)&&

                                    // running, r, n, g 
                                    !(frst === 114 && thrd === 110 && last === 103 && len === 7) &&

                                    // paused, p, u, d
                                    !(frst === 112 && thrd === 117 && last === 100 && len === 6) &&

                                    // reversed, r, v, d
                                    !(frst === 114 && thrd === 118 && last === 100 && len === 8) &&

                                    // step-start/step-end, s, e, (t/d)
                                    !(
                                        frst === 115 && thrd === 101 && 
                                        ((last === 116 && len === 10) || (last === 100 && len === 8)) 
                                    ) &&

                                    // ease/ease-in/ease-out/ease-in-out, e, s, e
                                    !(
                                        frst === 101 && thrd === 115 &&
                                        (
                                            (last === 101 && len === 4) ||
                                            (len === 11 || len === 7 || len === 8) && prop.charCodeAt(4) === 45
                                        )
                                    ) &&

                                    // durations, 0.4ms, .4s, 400ms ...
                                    isNaN(parseFloat(prop)) &&

                                    // handle spaces in cubic-bezier()/steps() functions
                                    prop.indexOf('(') === -1
                                ) {
                                    props[k] = animns + prop;
                                }
                            }

                            build += (j === 0 ? '' : ',') + props.join(' ').trim();
                        }
                    }
                    // explicit syntax, anims array should have only one elemenet
                    else {
                        // n
                        build += ((buff.charCodeAt(10) || 0) !== 110 ? '' : animns) + anims[0].trim();
                    }

                    // vendor prefix
                    buff = webkit + build + ';' + build + ';';
                }
                // appearance: a, p, p
                else if (first === 97 && second === 112 && third === 112) {
                    // vendor prefix -webkit- and -moz-
                    buff = (
                        webkit + buff + 
                        moz + buff + 
                        buff
                    );
                }
                // display: d, i, s
                else if (first === 100 && second === 105 && third === 115) {
                    // flex/inline-flex
                    if ((indexOf = buff.indexOf('flex')) !== -1) {
                        // e, inline-flex
                        temp = buff.charCodeAt(indexOf-2) === 101 ? 'inline-' : '';

                        // vendor prefix
                        buff = 'display:'+webkit+temp+'box;display:'+webkit+temp+'flex;'+ms+'flexbox;display:'+temp+'flex;';
                    }
                }
                // transforms & transitions: t, r, a 
                else if (first === 116 && second === 114 && third === 97) {
                    // vendor prefix -webkit- and -ms- if transform
                    buff = (
                        webkit + buff + 
                        (buff.charCodeAt(5) === 102 ? ms + buff : '') + 
                        buff
                    );
                }
                // hyphens: h, y, p
                // user-select: u, s, e
                else if (
                    (first === 104 && second === 121 && third === 112) ||
                    (first === 117 && second === 115 && third === 101)
                ) {
                    // vendor prefix all
                    buff = (
                        webkit + buff + 
                        moz + buff + 
                        ms + buff + 
                        buff
                    );
                }
                // flex: f, l, e
                else if (first === 102 && second === 108 && third === 101) {
                    // vendor prefix all but moz
                    buff = (
                        webkit + buff + 
                        ms + buff + 
                        buff
                    );
                }
                // order: o, r, d
                else if (first === 111 && second === 114 && third === 100) {
                    // vendor prefix all but moz
                    buff = (
                        webkit + buff + 
                        ms + 'flex-' + buff + 
                        buff
                    );
                }
                // align-items, align-center, align-self: a, l, i, -
                else if (first === 97 && second === 108 && third === 105 && (buff.charCodeAt(5) || 0) === 45) {
                    switch (buff.charCodeAt(6) || 0) {
                        // align-items, i
                        case 105: {
                            temp = buff.replace('-items', '');
                            buff = (
                                webkit + 'box-' + temp + 
                                ms + 'flex-'+ temp + 
                                buff
                            );
                            break;
                        }
                        // align-self, s
                        case 115: {
                            buff = (
                                ms + 'flex-item-' + buff.replace('-self', '') + 
                                buff
                            );
                            break;
                        }
                        // align-content
                        default: {
                            buff = (
                                ms + 'flex-line-pack' + buff.replace('align-content', '') + 
                                buff
                            );
                            break;
                        }
                    }
                }
                // { character, selector declaration
                else if (code === 123) {
                    depth++;

                    // push flat css
                    if (levels === 1 && flat.length !== 0) {
                        levels = 0;
                        flat = prefix + ' {' + flat + '}';

                        // middleware, flat context
                        if (use) {
                            temp = middleware(4, flat, line, column);
                        
                            if (temp != null) {
                                flat = temp;
                            }
                        }

                        output += flat;
                        flat = '';
                    }

                    if (special === 0 || type === 2) {
                        // nested selector
                        if (depth === 2) {
                            // discard first character {
                            caret++;

                            // inner content of block
                            inner = '';

                            var nestSelector = buff.substring(0, buff.length-1).split(',');
                            var prevSelector = prev.substring(0, prev.length-1).split(',');

                            // keep track of opening `{` and `}` occurrences
                            closed = 1;

                            // travel to the end of the block
                            while (caret < eof) {
                                char = styles.charCodeAt(caret);

                                // {, }, nested blocks may have nested blocks
                                if (char === 123) {
                                    closed++;
                                }
                                else if (char === 125) {
                                    closed--;
                                }

                                // break when the nested block has ended
                                if (closed === 0) {
                                    break;
                                }

                                // build content of nested block
                                inner += styles.charAt(caret++);
                            }

                            // handle multiple selectors: h1, h2 { div, h4 {} } should generate
                            // -> h1 div, h2 div, h2 h4, h2 div {}
                            for (var j = 0, length = prevSelector.length; j < length; j++) {
                                // extract value, prep index for reuse
                                temp = prevSelector[j];
                                prevSelector[j] = '';

                                // since there could also be multiple nested selectors
                                for (var k = 0, l = nestSelector.length; k < l; k++) {
                                    selector = temp.replace(prefix, '&').trim();
                                    sel = nestSelector[k].trim();

                                    if (sel.indexOf(' &') > 0) {
                                        selector = sel.replace('&', '').trim() + ' ' + selector;
                                    }
                                    else {
                                        selector = selector + ' ' + sel;
                                    }

                                    prevSelector[j] += selector.trim() + (k === l - 1  ? '' : ',');
                                }
                            }

                            // the `new line` is to avoid conflicts when the last line is a // line comment
                            buff = ('\n' + prevSelector.join(',') + ' {'+inner+'}');

                            // append nest
                            nest += buff.replace(/ +&/g, '');

                            // signature
                            nested = 1;

                            // clear current line, to avoid adding nested blocks to the normal flow
                            buff = '';

                            // decreament depth
                            depth--;
                        }
                        // top-level selector
                        else {
                            selectors = buff.split(',');
                            build = '';

                            // prefix multiple selectors with namesapces
                            // @example h1, h2, h3 --> [namespace] h1, [namespace] h1, ....
                            for (var j = 0, length = selectors.length; j < length; j++) {
                                var firstChar = (selector = selectors[j]).charCodeAt(0);

                                // ` `, trim if first character is a space
                                if (firstChar === 32) {
                                    firstChar = (selector = selector.trim()).charCodeAt(0);
                                }

                                // [, [title="a,b,..."]
                                if (firstChar === 91 && selector.indexOf(']') === -1) {
                                    for (var k = j + 1, l = length; k < l; k++) {
                                        var broken = (selector += ',' + selectors[k]).trim();

                                        // ], end
                                        if (broken.indexOf(']') !== -1) {
                                            length -= k;
                                            selectors.splice(j, k);
                                            break;
                                        }
                                    }
                                }

                                // &
                                if (firstChar === 38) {
                                    // before: & {
                                    selector = prefix + selector.substring(1);
                                    // after: ${prefix} {
                                }
                                else {
                                    // default to :global if & exist outside of the first non-space character
                                    if ((indexOf = selector.indexOf(' &')) > 0) {
                                        // `:`
                                        firstChar = 58;
                                        // before: html & {
                                        selector = ':global('+selector.substring(0, indexOf)+')' + selector.substring(indexOf);
                                        // after: html ${prefix} {
                                    }

                                    // :
                                    if (firstChar === 58) {
                                        var secondChar = selector.charCodeAt(1);

                                        // h, t, :host
                                        if (secondChar === 104 && selector.charCodeAt(4) === 116) {
                                            var nextChar = (selector = selector.substring(5)).charCodeAt(0);

                                            // :host(selector)                    
                                            if (nextChar === 40) {
                                                // before: `(selector)`
                                                selector = prefix + selector.substring(1).replace(')', '');
                                                // after: ${prefx} selector {
                                            }
                                            // :host-context(selector)
                                            else if (nextChar === 45) {
                                                indexOf = selector.indexOf(')');

                                                // before: `-context(selector)`
                                                selector = (
                                                    selector.substring(9, indexOf)+' '+prefix+selector.substring(indexOf+1)
                                                );
                                                // after: selector ${prefix} {
                                            }
                                            // :host
                                            else {
                                                selector = prefix + selector;
                                            }
                                        }
                                        // g, :global(selector)
                                        else if (secondChar === 103) {
                                            // before: `:global(selector)`
                                            selector = selector.substring(8).replace(')', '').replace('&', prefix);
                                            // after: selector
                                        }
                                        // :hover, :active, :focus, etc...
                                        else {
                                            selector = prefix + selector;
                                        }
                                    }
                                    // non-pseudo selectors
                                    else {
                                        selector = prefix + ' ' + selector;
                                    }
                                }

                                // if first selector do not prefix with `,`
                                build += (j === 0 ? selector : ',' + selector);
                            }

                            // cache current selector
                            prev = (buff = build);
                        }
                    }
                }
                // } character
                else if (code === 125) {
                    if (depth !== 0) {
                        depth--;
                    }

                    // concat nested css
                    if (depth === 0 && nested === 1) {
                        styles = styles.substring(0, caret+1) + nest + styles.substring(caret+1);
                        eof += nest.length;
                        nest = '';
                        nested = 0;
                        close++;
                    }
                }

                // @global/@keyframes
                if (special !== 0) {
                    // }, find closing tag
                    if (code === 125) {
                        close++;
                    } 
                    // {
                    else if (code === 123 && close !== 0) {
                        close--;
                    }

                    // append flat @media css
                    if (level === 1 && (code === 123 || close === 0) && flat.length !== 0) {
                        level = 0;
                        buff = prefix + ' {'+flat+'}' + buff;
                        flat = '';
                    }

                    // closing tag
                    if (close === 0) {
                        // @global
                        if (type === 0) {
                            buff = '';
                        }
                        // @keyframes 
                        else if (type === 1) {
                            // vendor prefix
                            buff = '}@'+blob+'}';

                            // reset
                            blob = '';
                        }
                        // @mixin
                        else if (type === 3) {
                            // append body of mixin
                            mixins[mixin].body = blob;

                            // reset
                            mixin = '';
                            buff = '';
                            blob = '';
                        }

                        // reset signatures
                        type = 0;
                        close--;
                        special--;
                    }
                    // @keyframes, @mixin
                    else if (type === 1 || type === 3) {
                        blob += buff;

                        if (type === 3) {
                            buff = '';
                        }
                    }
                    // @media flat context
                    else if (type === 2 && depth === 0) {
                        if (code !== 125) {
                            if (level === 0) {
                                flat = '';
                            }

                            flat += buff;
                            buff = '';
                        }

                        level = 1;
                    }
                }
                // flat context
                else if (depth === 0 && code !== 125) {
                    levels = 1;
                    flat = flat === void 0 ? buff : flat + buff;
                    buff = '';
                }
            }

            // append line to blck buffer
            blck += buff;

            // reset line buffer
            buff = '';

            // add blck buffer to output
            if (code === 125 && comment === 0 && (type === 0 || type === 4)) {                  
                // append if the block is not empty {}
                if (blck.charCodeAt(blck.length-2) !== 123) {
                    // middleware, block context
                    if (use && blck.length !== 0) {
                        temp = middleware(3, blck, line, column);

                        if (temp != null) {
                            blck = temp;
                        }
                    }

                    // append blck buffer
                    output += blck.trim();
                }

                // nested @media
                if (type === 4) {
                    // middleware, block context
                    if (use) {
                        temp = middleware(3, media, line, column);

                        if (temp != null) {
                            media = temp;
                        }
                    }

                    // reset
                    type = 0;

                    // concat nested @media block
                    output += media;
                }

                // reset blck buffer
                blck = '';
            }
        }
        // build line by line
        else {
            // \r, \n, new lines
            if (code === 13 || code === 10) {
                // ignore line and block comments
                if (comment === 2) {
                    // * character, block comment
                    if (buff.charCodeAt(buff.length - 2) === 42) {
                        buff = buff.substring(0, buff.indexOf('/*')).trim();
                    }
                    else {
                        // / character, does not start with `/`
                        if (buff.charCodeAt(0) !== 47 && (indexOf = buff.indexOf('//')) !== -1) {
                            buff = buff.substring(0, indexOf).trim();
                        }
                        else {
                            buff = '';
                        }
                    }

                    comments = 0;
                    comment = 0;
                }

                column = 0;
                line++;
            }
            // not `\t` tab character
            else if (code !== 9) {
                switch (code) {
                    // " character
                    case 34: {
                        // exit string " context / enter string context
                        strings = strings === 34 ? 0 : (strings === 39 ? 39 : 34);
                        break;
                    }
                    // ' character
                    case 39: {
                        // exit string ' context / enter string context
                        strings = strings === 39 ? 0 : (strings === 34 ? 34 : 39);
                        break;
                    }
                    // ( character
                    case 40: {
                        if (strings === 0) {
                            func = 1;
                        }
                        break;
                    }
                    // ) character
                    case 41: {
                        if (strings === 0) {
                            func = 0;
                        }
                        break;
                    }
                    // / character
                    case 47: {
                        if (strings === 0 && func !== 1 && comment < 2) {
                            // * character
                            if (comments === 0 || styles.charCodeAt(caret - 1) === 42) {
                                comment++;              
                            }

                            // * character, allow line comments in block comments
                            if (comments === 0 && styles.charCodeAt(caret + 1) === 42) {
                                comments = 1;
                            }
                        }
                        break;
                    }
                }

                // build line buffer
                buff += styles.charAt(caret);
            }
        }

        // move caret position
        caret++;

        // move column position
        column++;
    }

    // trailing flat css
    if (flat !== void 0 && flat.length !== 0) {
        flat = prefix + ' {' + flat + '}';

        // middleware, flat context
        if (use) {
            temp = middleware(4, flat, line, column);
        
            if (temp != null) {
                flat = temp;
            }
        }

        // append flat css
        output += flat;
    }

    // has variables
    if (compact && variables !== void 0) {
        // replace all variables
        for (var i = 0, length = variables.length; i < length; i++) {
            output = output.replace(new RegExp('var\\('+variables[i][0]+'\\)', 'g'), variables[i][1]);
        }
    }

    // middleware, output context
    if (use) {
        temp = middleware(6, output, line, column);
    
        if (temp != null) {
            output = temp;
        }
    }

    return output;
}


/**
 * use plugin
 * 
 * @param  {string|function|function[]} key
 * @param  {function?} plugin
 * @return {Object} {use, plugins}
 */
stylesheet.use = function (key, plugin) {
    var plugins = stylesheet.plugins;
    var length = plugins.length;

    if (plugin == null) {
        plugin = key;
        key = void 0;
    }

    if (plugin != null) {
        // object of plugins
        if (plugin.constructor === Object) {
            for (var name in plugin) {
                stylesheet.use(name, plugin[name]);
            }
        }
        // array of plugins
        else if (plugin.constructor === Array) {
            for (var i = 0, length = plugin.length; i < length; i++) {
                plugins[length++] = plugin[i];
            }
        }
        // single un-keyed plugin
        else if (key == null) {
            plugins[length] = plugin;
        }
        // keyed plugin
        else {
            var pattern = (key instanceof RegExp) ? key : new RegExp(key + '\\([ \\t\\r\\n]*([^\\0]*?)[ \\t\\r\\n]*\\)', 'g');
            var regex = /[ \t\r\n]*,[ \t\r\n]*/g;

            plugins[length] = function (ctx, str, line, col) {
                if (ctx === 6) {
                    str = str.replace(pattern, function (match, group) {
                        var args = group.replace(regex, ',').split(',');
                        var replace = plugin.apply(null, args);

                        return replace != null ? replace : match;
                    });

                    return str;
                }
            }
        }
    }

    return stylesheet;
};


/**
 * plugin store
 * 
 * @type {function[]}
 */
stylesheet.plugins = [];

