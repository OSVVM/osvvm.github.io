Report.sources['./../../../SynthWorks/Dev/_osvvm/OsvvmLibraries/Ethernet/TestStandAlone/TbStandAlone.vhd'] = '--\n--&nbsp;&nbsp;File&nbsp;Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TbStandAlone.vhd\n--&nbsp;&nbsp;Design&nbsp;Unit&nbsp;Name:&nbsp;&nbsp;TbStandAlone\n--&nbsp;&nbsp;Revision:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OSVVM&nbsp;MODELS&nbsp;STANDARD&nbsp;VERSION\n--\n--&nbsp;&nbsp;Maintainer:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jim&nbsp;Lewis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email:&nbsp;&nbsp;jim@synthworks.com\n--&nbsp;&nbsp;Contributor(s):\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jim&nbsp;Lewis&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jim@synthworks.com\n--\n--\n--&nbsp;&nbsp;Description:\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Top&nbsp;level&nbsp;testbench&nbsp;for&nbsp;AxiStreamTransmitter&nbsp;and&nbsp;AxiStreamReceiver\n--\n--\n--&nbsp;&nbsp;Developed&nbsp;by:\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SynthWorks&nbsp;Design&nbsp;Inc.\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VHDL&nbsp;Training&nbsp;Classes\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;http://www.SynthWorks.com\n--\n--&nbsp;&nbsp;Revision&nbsp;History:\n--&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version&nbsp;&nbsp;&nbsp;&nbsp;Description\n--&nbsp;&nbsp;&nbsp;&nbsp;10/2011&nbsp;&nbsp;&nbsp;2022.10&nbsp;&nbsp;&nbsp;&nbsp;Initial&nbsp;revision\n--\n--\n--&nbsp;&nbsp;This&nbsp;file&nbsp;is&nbsp;part&nbsp;of&nbsp;OSVVM.\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Copyright&nbsp;(c)&nbsp;2022&nbsp;by&nbsp;SynthWorks&nbsp;Design&nbsp;Inc.&nbsp;&nbsp;\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Licensed&nbsp;under&nbsp;the&nbsp;Apache&nbsp;License,&nbsp;Version&nbsp;2.0&nbsp;(the&nbsp;&quot;License&quot;);\n--&nbsp;&nbsp;you&nbsp;may&nbsp;not&nbsp;use&nbsp;this&nbsp;file&nbsp;except&nbsp;in&nbsp;compliance&nbsp;with&nbsp;the&nbsp;License.\n--&nbsp;&nbsp;You&nbsp;may&nbsp;obtain&nbsp;a&nbsp;copy&nbsp;of&nbsp;the&nbsp;License&nbsp;at\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://www.apache.org/licenses/LICENSE-2.0\n--&nbsp;&nbsp;\n--&nbsp;&nbsp;Unless&nbsp;required&nbsp;by&nbsp;applicable&nbsp;law&nbsp;or&nbsp;agreed&nbsp;to&nbsp;in&nbsp;writing,&nbsp;software\n--&nbsp;&nbsp;distributed&nbsp;under&nbsp;the&nbsp;License&nbsp;is&nbsp;distributed&nbsp;on&nbsp;an&nbsp;&quot;AS&nbsp;IS&quot;&nbsp;BASIS,\n--&nbsp;&nbsp;WITHOUT&nbsp;WARRANTIES&nbsp;OR&nbsp;CONDITIONS&nbsp;OF&nbsp;ANY&nbsp;KIND,&nbsp;either&nbsp;express&nbsp;or&nbsp;implied.\n--&nbsp;&nbsp;See&nbsp;the&nbsp;License&nbsp;for&nbsp;the&nbsp;specific&nbsp;language&nbsp;governing&nbsp;permissions&nbsp;and\n--&nbsp;&nbsp;limitations&nbsp;under&nbsp;the&nbsp;License.\n--&nbsp;&nbsp;\nlibrary&nbsp;ieee&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.std_logic_1164.all&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.numeric_std.all&nbsp;;\n&nbsp;&nbsp;use&nbsp;ieee.numeric_std_unsigned.all&nbsp;;\n&nbsp;\nlibrary&nbsp;osvvm&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;context&nbsp;osvvm.OsvvmContext&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\nlibrary&nbsp;osvvm_ethernet&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;context&nbsp;osvvm_ethernet.xMiiContext&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;\nentity&nbsp;TbStandAlone&nbsp;is\n&nbsp;&nbsp;generic&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;MII_INTERFACE&nbsp;:&nbsp;xMiiInterfaceType&nbsp;:=&nbsp;GMII&nbsp;;\n&nbsp;&nbsp;&nbsp;&nbsp;MII_BPS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;xMiiBpsType&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:=&nbsp;BPS_1G&nbsp;\n&nbsp;&nbsp;)&nbsp;;\nend&nbsp;entity&nbsp;TbStandAlone&nbsp;;&nbsp;\narchitecture&nbsp;TestHarness&nbsp;of&nbsp;TbStandAlone&nbsp;is\n&nbsp;\n&nbsp;&nbsp;constant&nbsp;tpd&nbsp;:&nbsp;time&nbsp;:=&nbsp;1&nbsp;ns&nbsp;;&nbsp;\n&nbsp;\n&nbsp;&nbsp;component&nbsp;TestCtrl&nbsp;is\n&nbsp;&nbsp;&nbsp;&nbsp;port&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Transaction&nbsp;Interfaces\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;StreamRecType&nbsp;;&nbsp;&nbsp;--&nbsp;Output&nbsp;from&nbsp;MAC\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;StreamRecType&nbsp;;&nbsp;&nbsp;--&nbsp;Input&nbsp;to&nbsp;MAC\n&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;StreamRecType&nbsp;;&nbsp;&nbsp;--&nbsp;Input&nbsp;to&nbsp;Phy\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;inout&nbsp;StreamRecType&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Output&nbsp;from&nbsp;Phy\n&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;end&nbsp;component&nbsp;TestCtrl&nbsp;;\n&nbsp;\n&nbsp;&nbsp;--&nbsp;xMii&nbsp;Transmitter&nbsp;Functional&nbsp;Interface\n&nbsp;&nbsp;signal&nbsp;GTx_Clk&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;&nbsp;--&nbsp;GMII,&nbsp;RGMII\n&nbsp;&nbsp;signal&nbsp;Tx_Clk&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;&nbsp;--&nbsp;MII\n&nbsp;&nbsp;signal&nbsp;TxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic_vector(0&nbsp;to&nbsp;7)&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Tx_En&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Tx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Tx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;\n&nbsp;&nbsp;--&nbsp;xMii&nbsp;Receiver&nbsp;Interface\n&nbsp;&nbsp;signal&nbsp;Rx_Clk&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;RxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic_vector(0&nbsp;to&nbsp;7)&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Rx_Dv&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Rx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Rx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Crs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;signal&nbsp;Col&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;std_logic&nbsp;;&nbsp;\n&nbsp;&nbsp;\n&nbsp;&nbsp;--&nbsp;Testbench&nbsp;Transaction&nbsp;Interface\n&nbsp;&nbsp;signal&nbsp;PhyTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;EthernetRecType&nbsp;;&nbsp;&nbsp;--&nbsp;input&nbsp;to&nbsp;Phy\n&nbsp;&nbsp;signal&nbsp;PhyRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;EthernetRecType&nbsp;;&nbsp;&nbsp;--&nbsp;output&nbsp;from&nbsp;Phy\n&nbsp;&nbsp;signal&nbsp;MacRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;EthernetRecType&nbsp;;&nbsp;&nbsp;--&nbsp;input&nbsp;to&nbsp;MAC\n&nbsp;&nbsp;signal&nbsp;MacTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;EthernetRecType&nbsp;;&nbsp;&nbsp;--&nbsp;output&nbsp;from&nbsp;MAC\n&nbsp;\nbegin\n&nbsp;\n&nbsp;&nbsp;process&nbsp;\n&nbsp;&nbsp;begin\n&nbsp;&nbsp;&nbsp;&nbsp;log(&quot;Generic&nbsp;settings.&nbsp;&nbsp;MII_INTERFACE&nbsp;=&nbsp;&quot;&nbsp;&amp;&nbsp;to_string(MII_INTERFACE)&nbsp;&amp;&nbsp;&quot;.&nbsp;&nbsp;&nbsp;MII_BPS&nbsp;=&nbsp;&quot;&nbsp;&amp;&nbsp;to_string(MII_BPS))&nbsp;;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;wait&nbsp;;&nbsp;\n&nbsp;&nbsp;end&nbsp;process&nbsp;;&nbsp;\n&nbsp;\n&nbsp;&nbsp;xMiiPhy_1&nbsp;:&nbsp;xMiiPhy&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;generic&nbsp;map&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MII_INTERFACE&nbsp;&nbsp;=&gt;&nbsp;MII_INTERFACE,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MII_BPS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MII_BPS,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEFAULT_DELAY&nbsp;&nbsp;=&gt;&nbsp;tpd\n&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;port&nbsp;map&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;xMii&nbsp;Transmitter&nbsp;Functional&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GTx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;GTx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;TxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_En&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_En&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;xMii&nbsp;Receiver&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;RxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Dv&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Dv&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Crs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Crs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Col&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Col&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Testbench&nbsp;Transaction&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;PhyTxRec&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;PhyRxRec\n&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;\n&nbsp;&nbsp;xMiiMac_1&nbsp;:&nbsp;xMiiMac&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;generic&nbsp;map&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MII_INTERFACE&nbsp;&nbsp;=&gt;&nbsp;MII_INTERFACE,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MII_BPS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MII_BPS,&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEFAULT_DELAY&nbsp;&nbsp;=&gt;&nbsp;tpd\n&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;port&nbsp;map&nbsp;(\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;xMii&nbsp;Transmitter&nbsp;Functional&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GTx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;GTx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;TxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_En&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_En&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Tx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;xMii&nbsp;Receiver&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Clk&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;RxD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Dv&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Dv&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Er&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Rx_Ctl&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Crs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Crs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Col&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;Col&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Testbench&nbsp;Transaction&nbsp;Interface\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MacTxRec&nbsp;&nbsp;&nbsp;&nbsp;,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MacRxRec\n&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;;\n&nbsp;&nbsp;\n&nbsp;&nbsp;\n&nbsp;&nbsp;TestCtrl_1&nbsp;:&nbsp;TestCtrl\n&nbsp;&nbsp;port&nbsp;map&nbsp;(&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;Testbench&nbsp;Transaction&nbsp;Interfaces\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MacTxRec,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MacRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;MacRxRec,\n&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyTxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;PhyTxRec,\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhyRxRec&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&gt;&nbsp;PhyRxRec\n&nbsp;&nbsp;)&nbsp;;&nbsp;\n&nbsp;\nend&nbsp;architecture&nbsp;TestHarness&nbsp;;';
Report.brushes['./../../../SynthWorks/Dev/_osvvm/OsvvmLibraries/Ethernet/TestStandAlone/TbStandAlone.vhd'] = 'vhdl'