var g_data = {"name":"C:/OsvvmLibraries/AXI4/common/src/Axi4CommonPkg.vhd","src":"--\n--  File Name:         Axi4CommonPkg.vhd\n--  Design Unit Name:  Axi4CommonPkg\n--  Revision:          OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--      Defines procedures to support Valid and Ready handshaking\n--      \n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    09/2017   2017       Initial revision\n--    01/2020   2020.01    Updated license notice\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2017 - 2020 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \nlibrary ieee ; \n  use ieee.std_logic_1164.all ;\n  use ieee.numeric_std.all ;\n  use ieee.numeric_std_unsigned.all ;\n  use ieee.math_real.all ;\n  \nlibrary osvvm ; \n  context osvvm.OsvvmContext ; \n      \npackage Axi4CommonPkg is \n\n  ------------------------------------------------------------\n  procedure DoAxiValidHandshake (\n  ------------------------------------------------------------\n    signal   Clk                    : in    std_logic ; \n    signal   Valid                  : out   std_logic ; \n    signal   Ready                  : in    std_logic ; \n    constant tpd_Clk_Valid          : in    time ;\n    constant AlertLogID             : in    AlertLogIDType := ALERTLOG_DEFAULT_ID; \n    constant TimeOutMessage         : in    string := \"\" ; \n    constant TimeOutPeriod          : in    time := - 1 sec \n  ) ;\n\n  ------------------------------------------------------------\n  procedure DoAxiReadyHandshake (\n  ------------------------------------------------------------\n    signal   Clk                    : in    std_logic ; \n    signal   Valid                  : in    std_logic ; \n    signal   Ready                  : inout std_logic ; \n    constant ReadyBeforeValid       : in    boolean ; \n    constant ReadyDelayCycles       : in    time ; \n    constant tpd_Clk_Ready          : in    time ;\n    constant AlertLogID             : in    AlertLogIDType := ALERTLOG_DEFAULT_ID; \n    constant TimeOutMessage         : in    string := \"\" ; \n    constant TimeOutPeriod          : in    time := - 1 sec \n  ) ;\n  \nend package Axi4CommonPkg ;\n\n-- /////////////////////////////////////////////////////////////////////////////////////////\n-- /////////////////////////////////////////////////////////////////////////////////////////\n\npackage body Axi4CommonPkg is\n \n  ------------------------------------------------------------\n  procedure DoAxiValidHandshake (\n  ------------------------------------------------------------\n    signal   Clk                    : in    std_logic ; \n    signal   Valid                  : out   std_logic ; \n    signal   Ready                  : in    std_logic ; \n    constant tpd_Clk_Valid          : in    time ;\n    constant AlertLogID             : in    AlertLogIDType := ALERTLOG_DEFAULT_ID; \n    constant TimeOutMessage         : in    string := \"\" ; \n    constant TimeOutPeriod          : in    time := - 1 sec \n  ) is\n  begin \n    \n    Valid <= '1' after tpd_Clk_Valid ;\n    \n    if TimeOutPeriod > 0 sec then \n      wait on Clk until Clk = '1' and Ready = '1' for TimeOutPeriod ;\n    else\n      wait on Clk until Clk = '1' and Ready = '1' ;\n    end if ;\n    \n    Valid <= '0' after tpd_Clk_Valid ;\n\n    if Ready /= '1' then \n    -- Check for TimeOut\n      Alert(\n        AlertLogID, \n        TimeOutMessage & \".  Ready: \" & to_string(Ready) & \"  Expected: 1\",\n        FAILURE\n      ) ;\n      wait until Clk = '1' ; \n    end if ; \n  end procedure DoAxiValidHandshake ;\n\n  ------------------------------------------------------------\n  procedure DoAxiReadyHandshake (\n  ------------------------------------------------------------\n    signal   Clk                    : in    std_logic ; \n    signal   Valid                  : in    std_logic ; \n    signal   Ready                  : inout std_logic ; \n    constant ReadyBeforeValid       : in    boolean ; \n    constant ReadyDelayCycles       : in    time ; \n    constant tpd_Clk_Ready          : in    time ;\n    constant AlertLogID             : in    AlertLogIDType := ALERTLOG_DEFAULT_ID; \n    constant TimeOutMessage         : in    string := \"\" ; \n    constant TimeOutPeriod          : in    time := - 1 sec \n  ) is\n  begin \n    \n    if ReadyBeforeValid then\n      Ready <= transport '1' after ReadyDelayCycles + tpd_Clk_Ready ;\n    end if ;  \n    \n    -- Wait to Receive Transaction\n    if TimeOutPeriod > 0 sec then \n      wait on Clk until Clk = '1' and Valid = '1' for TimeOutPeriod ;\n    else\n      wait on Clk until Clk = '1' and Valid = '1' ;\n    end if ;\n    \n    if Valid = '1' then \n      -- Proper handling\n      if not ReadyBeforeValid then \n        Ready <= '1' after ReadyDelayCycles + tpd_Clk_Ready ;\n      end if ; \n      \n      -- If ready not signaled yet, find ready at a rising edge of clk\n      if Ready /= '1' then\n        wait on Clk until Clk = '1' and (Ready = '1' or Valid /= '1') ;\n        AlertIf(\n          AlertLogID, \n          Valid /= '1', \n          TimeOutMessage & \n          \" Valid (\" & to_string(Valid) & \") \" & \n          \"deasserted before Ready asserted (\" & to_string(Ready) & \") \",\n          FAILURE\n        ) ;\n      end if ; \n    else \n      -- TimeOut handling\n      Alert(\n        AlertLogID, \n        TimeOutMessage & \" Valid: \" & to_string(Valid) & \"  Expected: 1\",\n        FAILURE\n      ) ;\n    end if ; \n    \n    -- End of operation\n    Ready <= '0' after tpd_Clk_Ready ;\n    \n    if Valid /= '1' then \n      -- TimeOut or Valid deasserted after before Ready asserted\n      wait until Clk = '1' ;\n    end if ; \n  end procedure DoAxiReadyHandshake ;\n\nend package body Axi4CommonPkg ; ","lang":"vhdl"};
processSrcData(g_data);