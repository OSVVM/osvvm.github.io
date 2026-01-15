SyntaxHighlighter.brushes.Edif = function()
{
    var level_0 = 'acLoad after annotate apply arc array arrayMacro arrayRelatedInfo arraySite ' +
                  'atLeast atMost author baseArray becomes between boolean booleanDisplay booleanMap ' +
                  'borderPattern borderWidth boundingBox cell cellRef cellType change circle color ' +
                  'comment commentGraphics compound connectLocation contents cornerType criticality ' +
                  'currentMap curve cycle dataOrigin dcFaninLoad dcFanoutLoad dcMaxFanin dcMaxFanout ' +
                  'delay delta derivation design designator difference direction display dominates dot ' +
                  'duration e edif edifLevel edifVersion enclosureDistance endType entry event exactly ' +
                  'external fabricate false figure figureArea figureGroup figureGroupObject ' +
                  'figureGroupOverride figureGroupRef figurePerimeter figureWidth fillPattern follow ' +
                  'forbiddenEvent globalPortRef greaterThan gridMap ignore includeFigureGroup initial ' +
                  'instance instanceBackAnnotate instanceGroup instanceMap instanceRef integer ' +
                  'integerDisplay interface interFigureGroupSpacing intersection ' +
                  'intraFigureGroupSpacing inverse isolated joined justify keywordDisplay keywordLevel ' +
                  'keywordMap lessThan library libraryRef listOfNets listOfPorts loadDelay logicAssign ' +
                  'logicInput logicList logicMapInput logicMapOutput logicOneOf logicOutput logicPort ' +
                  'logicRef logicValue logicWaveform maintain match member miNoMax miNoMaxDisplay mnm ' +
                  'multipleValueStr mustJoin name net netBackAnnotate netBundle netDelay netGroup ' +
                  'netMap netRef noChange nonPermutable notAllowed notchSpacing number numberDefinition ' +
                  'numberDisplay offPageConnector offsetEvent openShape orientation origin ' +
                  'overhangDistance overlapDistance oversize owner page pageSize parameter ' +
                  'parameterAssign parameterDisplay path pathDelay pathWidth parmutable ' +
                  'physicalDesignRule plug point pointDisplay pointList polygon port portBackAnnotate ' +
                  'portBundle portDelay portGroup portImplementation portInstance portList ' +
                  'portListAlias portMap portRef program property propertyDisplay protectionFrame pt ' +
                  'rangeVector rectangle rectangleSize rename resolves scale scaleX scaleY section ' +
                  'shape simulate simulationInfo singleValueSet site socket socketSet status steady ' +
                  'string stringDisplay strong symbol symmetry table tableDefault technology textHeight ' +
                  'timeInterval timeStamp timing transform transition trigger true unconstained ' +
                  'undefined union unit unused userData version view viewList viewMap viewRef viewType ' +
                  'visible voltageMap waveValue weak weakJoined when written';
    
    var level_1 = 'abs and ceiling concat constant constraint contents divide equal fix floor ' +
                  'increasing interface max min mod negate not or page pointSubtract pointSum product ' +
                  'strictlyIncreasing subtract sum technology variable xCoord xor yCoord';
    
    var level_2 = 'assign block contents else espace if interface iterate page technology then while';
    
    var keyword_level_1 = 'keywordAlias keywordMap';
    
    var keyword_level_2 = 'actual build formal generate keywordDefine keywordMap keywordParameters ' +
                          'literal optional';
    
    var keyword_level_3 = 'build collector forEach formal formalList generate';
    
    var keywords = [ level_0, level_1, level_2, keyword_level_1, keyword_level_2, keyword_level_3 ].join( ' ' );
    
    this.regexList =
    [
        { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'value' },
        { regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi, css: 'value' },
        { regex: new RegExp( this.getKeywords( keywords ), 'igm' ), css: 'keyword' }
    ];
}

SyntaxHighlighter.brushes.Edif.prototype = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Edif.aliases = [ 'edf' ];