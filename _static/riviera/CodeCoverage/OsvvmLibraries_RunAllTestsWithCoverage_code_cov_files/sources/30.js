Report.sources['./../../../SynthWorks/Dev/_osvvm/OsvvmLibraries/AXI4/common/src/Axi4CommonPkg.vhd'] = '--\n--&nbsp;&nbsp;File&nbsp;Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Axi4CommonPkg.vhd\n--&nbsp;&nbsp;Design&nbsp;Unit&nbsp;Name:&nbsp;&nbsp;Axi4CommonPkg\n--&nbsp;&nbsp;Revision:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OSVVM&nbsp;MODELS&nbsp;STANDARD&nbsp;VERSION\n--\n--&nbsp;&nbsp;Maintainer:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jim&nbsp;Lewis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email:&nbsp;&nbsp;jim@synthworks.com\n--&nbsp;&nbsp;Contributor(s):\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jim&nbsp;Lewis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jim@synthworks.com\n--\n--\n--&nbsp;&nbsp;Description:\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Defines&nbsp;procedures&nbsp;to&nbsp;support&nbsp;Valid&nbsp;and&nbsp;Ready&nbsp;handshaking\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n--\n--&nbsp;&nbsp;Developed&nbsp;by:\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SynthWorks&nbsp;Design&nbsp;Inc.\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VHDL&nbsp;Training&nbsp;Classes\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://www.SynthWorks.com\n--\n--&nbsp;&nbsp;Revision&nbsp;History:\n--&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version&nbsp;&nbsp;&nbsp;&nbsp;Description\n--&nbsp;&nbsp;&nbsp;&nbsp;09/2017&nbsp;&nbsp;&nbsp;2017&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Initial&nbsp;revision\n--&nbsp;&nbsp;&nbsp;&nbsp;01/2020&nbsp;&nbsp;&nbsp;2020.01&nbsp;&nbsp;&nbsp;&nbsp;Updated&nbsp;license&nbsp;notice\n--\n--\n--&nbsp;&nbsp;This&nbsp;file&nbsp;is&nbsp;part&nbsp;of&nbsp;OSVVM.\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Copyright&nbsp;(c)&nbsp;2017&nbsp;-&nbsp;2020&nbsp;by&nbsp;SynthWorks&nbsp;Design&nbsp;Inc.&nbsp;&nbsp;\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Licensed&nbsp;under&nbsp;the&nbsp;Apache&nbsp;License,&nbsp;Version&nbsp;2.0&nbsp;(the&nbsp;&quot;License&quot;);\n--&nbsp;&nbsp;you&nbsp;may&nbsp;not&nbsp;use&nbsp;this&nbsp;file&nbsp;except&nbsp;in&nbsp;compliance&nbsp;with&nbsp;the&nbsp;License.\n--&nbsp;&nbsp;You&nbsp;may&nbsp;obtain&nbsp;a&nbsp;copy&nbsp;of&nbsp;the&nbsp;License&nbsp;at\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://www.apache.org/licenses/LICENSE-2.0\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Unless&nbsp;required&nbsp;by&nbsp;applicable&nbsp;law&nbsp;or&nbsp;agreed&nbsp;to&nbsp;in&nbsp;writing,&nbsp;software\n--&nbsp;&nbsp;distributed&nbsp;under&nbsp;the&nbsp;License&nbsp;is&nbsp;distributed&nbsp;on&nbsp;an&nbsp;&quot;AS&nbsp;IS&quot;&nbsp;BASIS,\n--&nbsp;&nbsp;WITHOUT&nbsp;WARRANTIES&nbsp;OR&nbsp;CONDITIONS&nbsp;OF&nbsp;ANY&nbsp;KIND,&nbsp;either&nbsp;express&nbsp;or&nbsp;implied.\n--&nbsp;&nbsp;See&nbsp;the&nbsp;License&nbsp;for&nbsp;the&nbsp;specific&nbsp;language&nbsp;governing&nbsp;permissions&nbsp;and\n--&nbsp;&nbsp;limitations&nbsp;under&nbsp;the&nbsp;License.\n--&nbsp;&nbsp;\nlibrary&nbsp;ieee&nbsp;;&nbsp;\n&nbsp;&nbsp;use&nbsp;ieee.std_logic_1164.all&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.numeric_std.all&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.numeric_std_unsigned.all&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.math_real.all&nbsp;;\n&nbsp;&nbsp;\nlibrary&nbsp;osvvm&nbsp;;&nbsp;\n&nbsp;&nbsp;context&nbsp;osvvm.OsvvmContext&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\npackage&nbsp;Axi4CommonPkg&nbsp;is&nbsp;\n&nbsp;\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;procedure&nbsp;DoAxiValidHandshake&nbsp;(\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;out&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;tpd_Clk_Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;AlertLogID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;AlertLogIDType&nbsp;:=&nbsp;ALERTLOG_DEFAULT_ID;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutMessage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;string&nbsp;:=&nbsp;&quot;&quot;&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutPeriod&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;:=&nbsp;-&nbsp;1&nbsp;sec&nbsp;\n&nbsp;&nbsp;)&nbsp;;\n&nbsp;\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;procedure&nbsp;DoAxiReadyHandshake&nbsp;(\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;ReadyBeforeValid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;boolean&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;ReadyDelayCycles&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;tpd_Clk_Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;AlertLogID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;AlertLogIDType&nbsp;:=&nbsp;ALERTLOG_DEFAULT_ID;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutMessage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;string&nbsp;:=&nbsp;&quot;&quot;&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutPeriod&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;:=&nbsp;-&nbsp;1&nbsp;sec&nbsp;\n&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;\nend&nbsp;package&nbsp;Axi4CommonPkg&nbsp;;\n&nbsp;\n--&nbsp;/////////////////////////////////////////////////////////////////////////////////////////\n--&nbsp;/////////////////////////////////////////////////////////////////////////////////////////\n&nbsp;\npackage&nbsp;body&nbsp;Axi4CommonPkg&nbsp;is\n&nbsp;\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;procedure&nbsp;DoAxiValidHandshake&nbsp;(\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;out&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;tpd_Clk_Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;AlertLogID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;AlertLogIDType&nbsp;:=&nbsp;ALERTLOG_DEFAULT_ID;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutMessage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;string&nbsp;:=&nbsp;&quot;&quot;&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutPeriod&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;:=&nbsp;-&nbsp;1&nbsp;sec&nbsp;\n&nbsp;&nbsp;)&nbsp;is\n&nbsp;&nbsp;begin&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;Valid&nbsp;&lt;=&nbsp;&apos;1&apos;&nbsp;after&nbsp;tpd_Clk_Valid&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;TimeOutPeriod&nbsp;&gt;&nbsp;0&nbsp;sec&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;on&nbsp;Clk&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;and&nbsp;Ready&nbsp;=&nbsp;&apos;1&apos;&nbsp;for&nbsp;TimeOutPeriod&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;else\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;on&nbsp;Clk&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;and&nbsp;Ready&nbsp;=&nbsp;&apos;1&apos;&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;Valid&nbsp;&lt;=&nbsp;&apos;0&apos;&nbsp;after&nbsp;tpd_Clk_Valid&nbsp;;\n&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;Ready&nbsp;/=&nbsp;&apos;1&apos;&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Check&nbsp;for&nbsp;TimeOut\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alert(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AlertLogID,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TimeOutMessage&nbsp;&amp;&nbsp;&quot;.&nbsp;&nbsp;Ready:&nbsp;&quot;&nbsp;&amp;&nbsp;to_string(Ready)&nbsp;&amp;&nbsp;&quot;&nbsp;&nbsp;Expected:&nbsp;1&quot;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAILURE\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;\n&nbsp;&nbsp;end&nbsp;procedure&nbsp;DoAxiValidHandshake&nbsp;;\n&nbsp;\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;procedure&nbsp;DoAxiReadyHandshake&nbsp;(\n&nbsp;&nbsp;------------------------------------------------------------\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Valid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;signal&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;ReadyBeforeValid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;boolean&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;ReadyDelayCycles&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;tpd_Clk_Ready&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;AlertLogID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;AlertLogIDType&nbsp;:=&nbsp;ALERTLOG_DEFAULT_ID;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutMessage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;string&nbsp;:=&nbsp;&quot;&quot;&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;constant&nbsp;TimeOutPeriod&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;in&nbsp;&nbsp;&nbsp;&nbsp;time&nbsp;:=&nbsp;-&nbsp;1&nbsp;sec&nbsp;\n&nbsp;&nbsp;)&nbsp;is\n&nbsp;&nbsp;begin&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;ReadyBeforeValid&nbsp;then\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&lt;=&nbsp;transport&nbsp;&apos;1&apos;&nbsp;after&nbsp;ReadyDelayCycles&nbsp;+&nbsp;tpd_Clk_Ready&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Wait&nbsp;to&nbsp;Receive&nbsp;Transaction\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;TimeOutPeriod&nbsp;&gt;&nbsp;0&nbsp;sec&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;on&nbsp;Clk&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;and&nbsp;Valid&nbsp;=&nbsp;&apos;1&apos;&nbsp;for&nbsp;TimeOutPeriod&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;else\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;on&nbsp;Clk&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;and&nbsp;Valid&nbsp;=&nbsp;&apos;1&apos;&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;Valid&nbsp;=&nbsp;&apos;1&apos;&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Proper&nbsp;handling\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;not&nbsp;ReadyBeforeValid&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&lt;=&nbsp;&apos;1&apos;&nbsp;after&nbsp;ReadyDelayCycles&nbsp;+&nbsp;tpd_Clk_Ready&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;If&nbsp;ready&nbsp;not&nbsp;signaled&nbsp;yet,&nbsp;find&nbsp;ready&nbsp;at&nbsp;a&nbsp;rising&nbsp;edge&nbsp;of&nbsp;clk\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;Ready&nbsp;/=&nbsp;&apos;1&apos;&nbsp;then\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;on&nbsp;Clk&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;and&nbsp;(Ready&nbsp;=&nbsp;&apos;1&apos;&nbsp;or&nbsp;Valid&nbsp;/=&nbsp;&apos;1&apos;)&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AlertIf(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AlertLogID,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Valid&nbsp;/=&nbsp;&apos;1&apos;,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TimeOutMessage&nbsp;&amp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;&nbsp;Valid&nbsp;(&quot;&nbsp;&amp;&nbsp;to_string(Valid)&nbsp;&amp;&nbsp;&quot;)&nbsp;&quot;&nbsp;&amp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;deasserted&nbsp;before&nbsp;Ready&nbsp;asserted&nbsp;(&quot;&nbsp;&amp;&nbsp;to_string(Ready)&nbsp;&amp;&nbsp;&quot;)&nbsp;&quot;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAILURE\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;else&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;TimeOut&nbsp;handling\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alert(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AlertLogID,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TimeOutMessage&nbsp;&amp;&nbsp;&quot;&nbsp;Valid:&nbsp;&quot;&nbsp;&amp;&nbsp;to_string(Valid)&nbsp;&amp;&nbsp;&quot;&nbsp;&nbsp;Expected:&nbsp;1&quot;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAILURE\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;End&nbsp;of&nbsp;operation\n&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&lt;=&nbsp;&apos;0&apos;&nbsp;after&nbsp;tpd_Clk_Ready&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;Valid&nbsp;/=&nbsp;&apos;1&apos;&nbsp;then&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;TimeOut&nbsp;or&nbsp;Valid&nbsp;deasserted&nbsp;after&nbsp;before&nbsp;Ready&nbsp;asserted\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;until&nbsp;Clk&nbsp;=&nbsp;&apos;1&apos;&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;if&nbsp;;&nbsp;\n&nbsp;&nbsp;end&nbsp;procedure&nbsp;DoAxiReadyHandshake&nbsp;;\n&nbsp;\nend&nbsp;package&nbsp;body&nbsp;Axi4CommonPkg&nbsp;;&nbsp;';
Report.brushes['./../../../SynthWorks/Dev/_osvvm/OsvvmLibraries/AXI4/common/src/Axi4CommonPkg.vhd'] = 'vhdl'