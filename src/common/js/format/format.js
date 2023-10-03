window.SINGLE_TAB = '  ';
window.ImgCollapsed = '/tools/json_format/Collapsed.gif';
window.ImgExpanded = '/tools/json_format/Expanded.gif';
window.QuoteKeys = true;
function $id(id) {
  return document.getElementById(id);
}
function IsArray(obj) {
  return obj && typeof obj === 'object' && typeof obj.length === 'number' && !obj.propertyIsEnumerable('length');
}

function Process() {
  SetTab();
  window.IsCollapsible = $id('CollapsibleView').checked;
  let json = $id('RawJson').value;

  let html = '';

  try {
    if (json == '') {
      json = '""';

      return;
    }
    const obj = eval(`[${json  }]`);

    html = ProcessObject(obj[0], 0, false, false, false);
    $id('Canvas').innerHTML = `<PRE class='CodeContainer'>${html }</PRE>`;
  } catch (e) {
    alert(`JSON数据格式不正确:\n${e.message}`);
    $id('Canvas').innerHTML = '';
  }
}
window._dateObj = new Date();
window._regexpObj = new RegExp();
function ProcessObject(obj, indent, addComma, isArray, isPropertyContent) {
  let html = '';

  const comma = addComma ? '<span class=\'Comma\'>,</span> ' : '';

  const type = typeof obj;

  let clpsHtml = '';

  if (IsArray(obj)) {
    if (obj.length == 0) {
      html += GetRow(indent, `<span class='ArrayBrace'>[ ]</span>${comma}`, isPropertyContent);
    } else {
      clpsHtml = window.IsCollapsible ? `<span><img src="${
        window.ImgExpanded
      }" onClick="ExpImgClicked(this)" /></span><span class='collapsible'>`: '';
      html += GetRow(indent, `<span class='ArrayBrace'>[</span>${clpsHtml}`, isPropertyContent);
      for (let i = 0; i < obj.length; i++) {
        html += ProcessObject(obj[i], indent + 1, i < obj.length - 1, true, false);
      }
      clpsHtml = window.IsCollapsible ? '</span>' : '';
      html += GetRow(indent, `${clpsHtml}<span class='ArrayBrace'>]</span>${comma}`);
    }
  } else if (type == 'object') {
    if (obj == null) {
      html += FormatLiteral('null', '', comma, indent, isArray, 'Null');
    } else if (obj.constructor == window._dateObj.constructor) {
      html += FormatLiteral(
        `new Date(${obj.getTime()}) /*${obj.toLocaleString()}*/`,
        '',
        comma,
        indent,
        isArray,
        'Date',
      );
    } else if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral(`new RegExp(${ obj })`, '', comma, indent, isArray, 'RegExp');
    } else {
      let numProps = 0;

      for (var prop in obj) {
 numProps++; 
}
      if (numProps == 0) {
        html += GetRow(indent, `<span class='ObjectBrace'>{ }</span>${comma}`, isPropertyContent);
      } else {
        clpsHtml = window.IsCollapsible ? `<span><img src="${
          window.ImgExpanded
        }" onClick="ExpImgClicked(this)" /></span><span class='collapsible'>`: '';
        html += GetRow(indent, `<span class='ObjectBrace'>{</span>${clpsHtml}`, isPropertyContent);

        let j = 0;

        for (var prop in obj) {
          const quote = window.QuoteKeys ? '"' : '';

          html += GetRow(
            indent + 1,
            "<span class='PropertyName'>" +
              quote +
              prop +
              quote +
              '</span>: ' +
              ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true),
          );
        }

        clpsHtml = window.IsCollapsible ? '</span>' : '';

        html += GetRow(indent, `${clpsHtml}<span class='ObjectBrace'>}</span>${comma}`);
      }
    }
  } else if (type == 'number') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Number');
  } else if (type == 'boolean') {
    html += FormatLiteral(obj, '', comma, indent, isArray, 'Boolean');
  } else if (type == 'function') {
    if (obj.constructor == window._regexpObj.constructor) {
      html += FormatLiteral(`new RegExp(${ obj })`, '', comma, indent, isArray, 'RegExp');
    } else {
      obj = FormatFunction(indent, obj);

      html += FormatLiteral(obj, '', comma, indent, isArray, 'Function');
    }
  } else if (type == 'undefined') {
    html += FormatLiteral('undefined', '', comma, indent, isArray, 'Null');
  } else {
    html += FormatLiteral(
      obj.toString().split('\\').join('\\\\').split('"').join('\\"'),
      '"',
      comma,
      indent,
      isArray,
      'String',
    );
  }

  return html;
}

function FormatLiteral(literal, quote, comma, indent, isArray, style) {
  if (typeof literal === 'string') { literal = literal.split('<').join('&lt;')
    .split('>')
    .join('&gt;'); }

  let str = `<span class='${style }'>${ quote }${literal }${quote }${comma }</span>`;

  if (isArray) {
 str = GetRow(indent, str); 
}

  return str;
}

function FormatFunction(indent, obj) {
  let tabs = '';

  for (var i = 0; i < indent; i++) {
 tabs += window.TAB; 
}

  const funcStrArray = obj.toString().split('\n');

  let str = '';

  for (var i = 0; i < funcStrArray.length; i++) {
    str += `${(i == 0 ? '' : tabs) + funcStrArray[i]}\n`;
  }

  return str;
}

function GetRow(indent, data, isPropertyContent) {
  let tabs = '';

  for (let i = 0; i < indent && !isPropertyContent; i++) {
 tabs += window.TAB; 
}

  if (data != null && data.length > 0 && data.charAt(data.length - 1) != '\n') { data = `${data}\n`; }

  return tabs + data;
}

function CollapsibleViewClicked() {
  $id('CollapsibleViewDetail').style.visibility = $id('CollapsibleView').checked ? 'visible' : 'hidden';

  Process();
}

function QuoteKeysClicked() {
  window.QuoteKeys = $id('QuoteKeys').checked;

  Process();
}

function CollapseAllClicked() {
  EnsureIsPopulated();

  TraverseChildren(
    $id('Canvas'),
    (element) => {
      if (element.className == 'collapsible') {
        MakeContentVisible(element, false);
      }
    },
    0,
  );
}

function ExpandAllClicked() {
  EnsureIsPopulated();

  TraverseChildren(
    $id('Canvas'),
    (element) => {
      if (element.className == 'collapsible') {
        MakeContentVisible(element, true);
      }
    },
    0,
  );
}

function MakeContentVisible(element, visible) {
  const img = element.previousSibling.firstChild;

  if (Boolean(img.tagName) && img.tagName.toLowerCase() == 'img') {
    element.style.display = visible ? 'inline' : 'none';

    element.previousSibling.firstChild.src = visible ? window.ImgExpanded : window.ImgCollapsed;
  }
}

function TraverseChildren(element, func, depth) {
  for (let i = 0; i < element.childNodes.length; i++) {
    TraverseChildren(element.childNodes[i], func, depth + 1);
  }

  func(element, depth);
}

function ExpImgClicked(img) {
  const container = img.parentNode.nextSibling;

  if (!container) {
 return; 
}

  let disp = 'none';

  let src = window.ImgCollapsed;

  if (container.style.display == 'none') {
    disp = 'inline';

    src = window.ImgExpanded;
  }

  container.style.display = disp;

  img.src = src;
}

function CollapseLevel(level) {
  EnsureIsPopulated();

  TraverseChildren(
    $id('Canvas'),
    (element, depth) => {
      if (element.className == 'collapsible') {
        if (depth >= level) {
          MakeContentVisible(element, false);
        } else {
          MakeContentVisible(element, true);
        }
      }
    },
    0,
  );
}

function TabSizeChanged() {
  Process();
}

function SetTab() {
  const select = $id('TabSize');

  window.TAB = MultiplyString(parseInt(select.options[select.selectedIndex].value), window.SINGLE_TAB);
}

function EnsureIsPopulated() {
  if (!$id('Canvas').innerHTML && Boolean($id('RawJson').value)) {
 Process(); 
}

}

function MultiplyString(num, str) {
  const sb = [];

  for (let i = 0; i < num; i++) {
    sb.push(str);
  }

  return sb.join('');
}

function SelectAllClicked() {
  if (Boolean(document.selection) && Boolean(document.selection.empty)) {
    document.selection.empty();
  } else if (window.getSelection) {
    const sel = window.getSelection();

    if (sel.removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  }

  const range =
    Boolean(document.body) && Boolean(document.body.createTextRange) ? document.body.createTextRange() : document.createRange();

  if (Boolean(range.selectNode)) { range.selectNode($id('Canvas')); } else if (range.moveToElementText) { range.moveToElementText($id('Canvas')); }

  if (Boolean(range.select)) { range.select($id('Canvas')); } else { window.getSelection().addRange(range); }
  }
}

function LinkToJson() {
  let val = $id('RawJson').value;

  val = escape(val.split('/n').join(' ')
.split('/r')
.join(' '));

  $id('InvisibleLinkUrl').value = val;

  $id('InvisibleLink').submit();
}
