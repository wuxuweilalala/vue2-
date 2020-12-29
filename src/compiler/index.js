const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function start(tagName, attributes) {
    console.log(tagName);
    console.log(attributes);
}

function end(tagName) {
    console.log(tagName);
}

function chars(text) {
    console.log(text);
}

function parseHTMl(html) {

    function advance(len) {
        html = html.substring(len)
    }


    function parseStartTag() {
        const start = html.match(startTagOpen)

        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }

        return false
    }

    function parseEndTag(html) {

    }

    while (html) { //看解析的内容是否存在，如果存在就继续解析
        const textEnd = html.indexOf('<');
        if (textEnd == 0) {
            const startTagMath = parseStartTag(html)
            if (startTagMath) {
                start(startTagMath.tagName,startTagMath.attrs);
                continue;
            }
            const endTagMatch  = html.match(endTag)
            if(endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length);
                continue;
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0,textEnd);
        }

        if(text) {
            chars(text);
            advance(text.length);
        }
    }
}


export function compileToFunction(template) {
    parseHTMl(template)

    return function () {

    }
}