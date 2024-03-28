SyntaxHighlighter.brushes.Vhdl = function()
{
    var keywords = 'abs access add after alias all and architecture ' +
                   'array assert attribute begin bit block body buffer ' +
                   'bus case component configuration constant downto ' +
                   'else elsif end entity error exit file for function ' +
                   'generate generic group if impure in inertial inout is ' +
                   'label library loop map mod nand next nor not null ' +
                   'of on or others out package port procedure process ' +
                   'pure range record register reject rem report return ' +
                   'rol ror select severity signal sla sll sra srl ' +
                   'subtype then to transport type unaffected until use ' +
                   'variable wait when while with xnor xor';  

    var attributes = "'base 'high 'low 'ascending 'image 'value 'pos 'val " +
                     "'succ 'pred 'leftof 'rightof 'left 'right 'high 'low " +
                     "'range 'reverse_range 'length 'ascending 'delayed " +
                     "'stable 'quiet 'transaction 'event 'active 'last_event " +
                     "'last_active 'last_value 'driving 'driving_value " +
                     "'simple_name 'instance_name 'path_name";

    this.regexList =
    [
        { regex: SyntaxHighlighter.regexLib.singleLineCComments,       css: 'comments' },
        { regex: /--.*/g,                                              css: 'comments' },  
        { regex: SyntaxHighlighter.regexLib.multiLineCComments,        css: 'comments' },
        { regex: SyntaxHighlighter.regexLib.doubleQuotedString,        css: 'value' },
        { regex: new RegExp( this.getAttributes( attributes ), 'gi' ), css: 'plain' },
        { regex: SyntaxHighlighter.regexLib.singleQuotedString,        css: 'value' },
        { regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,                css: 'value' },
        { regex: /(?!\@interface\b)\@[\$\w]+\b/g,                      css: 'color1' },
        { regex: /\@interface\b/g,                                     css: 'color2' },
        { regex: /\\.+?\\/g,                                           css: 'plain' },
        { regex: new RegExp( this.getKeywords( keywords ), 'gmi' ),    css: 'keyword' }
    ];
}

SyntaxHighlighter.brushes.Vhdl.prototype = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Vhdl.aliases = [ 'vhdl' ];
