var g_data = {"name":"C:/OsvvmLibraries/UART/testbench/TbUart_SendGet1.vhd","src":"--\n--  File Name:         TbUart_SendGet1.vhd\n--  Design Unit Name:  TbUart_SendGet1\n--  OSVVM Release:     OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--    Validate send, get, check transactions with errors in PE, SE, and BE \n--\n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    1999      1999.00    Developed for SynthWorks' Advanced VHDL Testbenches and Verification Class\n--    05/2019   2019.05    Updated for OSVVM public release\n--    01/2020   2020.01    Updated license notice\n--\n--\n--  This file is part of OSVVM.\n--\n--  Copyright (c) 1999 - 2020 by SynthWorks Design Inc.\n--\n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--\n--      https://www.apache.org/licenses/LICENSE-2.0\n--\n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--\n\narchitecture SendGet1 of TestCtrl is\n\n  signal CheckErrors : boolean ;\n  signal TestActive  : boolean := TRUE ;\n\n  signal TestDone    : integer_barrier := 1 ;\n  \n  use osvvm_uart.ScoreboardPkg_Uart.all ; \n  signal UartScoreboard : osvvm_uart.ScoreboardPkg_Uart.ScoreboardIdType ; \n\nbegin\n\n  ------------------------------------------------------------\n  -- ControlProc\n  --   Set up AlertLog and wait for end of test\n  ------------------------------------------------------------\n  ControlProc : process\n  begin\n    -- Initialization of test\n    SetTestName(\"TbUart_SendGet1\") ;\n    SetLogEnable(PASSED, TRUE) ;    -- Enable PASSED logs\n    UartScoreboard <= NewID(\"UART_SB1\") ; \n    \n    wait for 0 ns ;  \n    SetAlertLogOptions(WriteTimeLast => FALSE) ; \n    SetAlertLogOptions(TimeJustifyAmount => 16) ; \n    SetAlertLogJustify ; \n\n    -- Wait for testbench initialization \n    wait for 0 ns ;  wait for 0 ns ;\n    TranscriptOpen(OSVVM_RESULTS_DIR & \"TbUart_SendGet1.txt\") ;\n    SetTranscriptMirror(TRUE) ; \n\n    -- Wait for Design Reset\n    wait until nReset = '1' ;  \n    ClearAlerts ;\n    \n    -- Wait for test to finish\n    WaitForBarrier(TestDone, 10 ms) ;\n    AlertIf(now >= 10 ms, \"Test finished due to timeout\") ;\n    AlertIf(GetAffirmCount < 1, \"Test is not Self-Checking\");\n    \n    TranscriptClose ; \n--    AlertIfDiff(\"./results/TbUart_SendGet1.txt\", \"../Uart/testbench/validated_results/TbUart_SendGet1.txt\", \"\") ; \n    \n    EndOfTestReports(ExternalErrors => (FAILURE => 0, ERROR => -4, WARNING => 0)) ; \n    std.env.stop ;\n    wait ; \n  end process ControlProc ; \n\n  ------------------------------------------------------------\n  -- UartTbTxProc\n  --   Provides transactions to UartTx via Send\n  --   Used to test the UART Receiver in the UUT\n  ------------------------------------------------------------\n  UartTbTxProc : process\n    variable UartTxID : AlertLogIDType ; \n    variable TransactionCount, ErrorCount : integer ;\n  begin\n    \n    GetAlertLogID(UartTxRec, UartTxID) ; \n    SetLogEnable(UartTxID, INFO, TRUE) ;\n    WaitForClock(UartTxRec, 2) ; \n    \n    --  Sequence 1\n    Send(UartTxRec, X\"50\") ;\n    Send(UartTxRec, X\"51\", UARTTB_PARITY_ERROR) ;\n    Send(UartTxRec, X\"52\", UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"53\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"11\", UARTTB_BREAK_ERROR) ;\n    \n    GetTransactionCount(UartTxRec, TransactionCount) ;\n    AffirmIfEqual(UartTxID, TransactionCount, 5, \"Transaction Count\") ;\n    GetErrorCount(UartTxRec, ErrorCount) ;\n    AffirmIfEqual(UartTxID, ErrorCount, 0, \"Error Count\") ;\n    \n    --  Sequence 2\n    Send(UartTxRec, X\"60\", UARTTB_NO_ERROR) ;\n    Send(UartTxRec, X\"61\", UARTTB_PARITY_ERROR) ;\n    Send(UartTxRec, X\"62\", UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"63\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"12\", UARTTB_BREAK_ERROR) ;\n    \n    --  Sequence 3\n    Send(UartTxRec, X\"70\", UARTTB_NO_ERROR) ;\n    Send(UartTxRec, X\"71\", UARTTB_PARITY_ERROR) ;\n    Send(UartTxRec, X\"72\", UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"73\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"13\", UARTTB_BREAK_ERROR) ;\n    \n    --  Sequence 4\n    Send(UartTxRec, X\"80\") ;\n    Send(UartTxRec, X\"81\", UARTTB_PARITY_ERROR) ;\n    Send(UartTxRec, X\"82\", UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"83\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n    Send(UartTxRec, X\"14\", UARTTB_BREAK_ERROR) ;\n    WaitForClock(UartTxRec, 8) ;\n    \n    GetTransactionCount(UartTxRec, TransactionCount) ;\n    AffirmIfEqual(UartTxID, TransactionCount, 20, \"Transaction Count\") ;\n    GetErrorCount(UartTxRec, ErrorCount) ;\n    AffirmIfEqual(UartTxID, ErrorCount, 0, \"Error Count\") ;  -- Nonsence test since TX does not check\n\n    TestActive <= FALSE ;  -- last one \n\n    ------------------------------------------------------------\n    -- End of test.  Wait for outputs to propagate and signal TestDone\n    wait for 4 * UART_BAUD_PERIOD_115200 ;\n    WaitForBarrier(TestDone) ;\n    wait ;\n  end process UartTbTxProc ;\n\n\n  ------------------------------------------------------------\n  -- UartTbRxProc\n  --   Gets transactions from UartRx via UartGet and UartCheck\n  --   Used to test the UART Transmitter in the UUT\n  ------------------------------------------------------------\n  UartTbRxProc : process\n    variable RxStim, ExpectStim : UartStimType ; \n    variable Available, TryExpectValid : boolean ;\n\n    variable UartRxID : AlertLogIDType ; \n    variable TransactionCount, ErrorCount : integer ;\n  begin\n    \n    GetAlertLogID(UartRxRec, UartRxID) ; \n    WaitForClock(UartRxRec, 2) ; \n\n    for i in 1 to 5 loop     \n      case i is\n        when 1 =>  ExpectStim := (X\"50\", UARTTB_NO_ERROR) ;\n        when 2 =>  ExpectStim := (X\"51\", UARTTB_PARITY_ERROR) ;\n        when 3 =>  ExpectStim := (X\"52\", UARTTB_STOP_ERROR) ;\n        when 4 =>  ExpectStim := (X\"53\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n        when 5 =>  ExpectStim := (X\"00\", UARTTB_BREAK_ERROR) ;\n      end case ; \n      -- Get with one parameter\n      Get(UartRxRec, RxStim.Data) ;\n--      RxStim.Error := std_logic_vector(UartRxRec.ParamFromModel) ; \n      RxStim.Error := SafeResize(UartRxRec.ParamFromModel, RxStim.Error'length) ; \n      AffirmIf(osvvm_UART.UartTbPkg.Match(RxStim, ExpectStim), \n        \"Received: \" & to_string(RxStim), \n        \".  Expected: \" & to_string(ExpectStim) ) ;\n    end loop ;\n    \n    for i in 1 to 5 loop     \n      case i is\n        when 1 =>  ExpectStim := (X\"60\", UARTTB_NO_ERROR) ;\n        when 2 =>  ExpectStim := (X\"61\", UARTTB_PARITY_ERROR) ;\n        when 3 =>  ExpectStim := (X\"62\", UARTTB_STOP_ERROR) ;\n        when 4 =>  ExpectStim := (X\"63\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n        when 5 =>  ExpectStim := (X\"64\", UARTTB_BREAK_ERROR) ;\n      end case ; \n      -- Get with two parameters\n      Get(UartRxRec, RxStim.Data, RxStim.Error) ;\n      AffirmIf(osvvm_UART.UartTbPkg.Match(RxStim, ExpectStim), \n        \"Received: \" & to_string(RxStim), \n        \".  Expected: \" & to_string(ExpectStim) ) ;\n    end loop ;\n    \n    GetTransactionCount(UartRxRec, TransactionCount) ;\n    AffirmIfEqual(UartRxID, TransactionCount, 10, \"Transaction Count\") ;\n    GetErrorCount(UartRxRec, ErrorCount) ;\n    AffirmIfEqual(UartRxID, ErrorCount, 0, \"Error Count\") ;\n        \n    for i in 1 to 5 loop     \n      case i is\n        when 1 =>  ExpectStim := (X\"70\", UARTTB_NO_ERROR) ;\n        when 2 =>  ExpectStim := (X\"71\", UARTTB_PARITY_ERROR) ;\n        when 3 =>  ExpectStim := (X\"72\", UARTTB_STOP_ERROR) ;\n        when 4 =>  ExpectStim := (X\"73\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n        when 5 =>  ExpectStim := (X\"74\", UARTTB_BREAK_ERROR) ;\n      end case ; \n      -- Check with one parameter\n      Check(UartRxRec, ExpectStim.Data) ;\n--      RxStim.Data  := std_logic_vector(UartRxRec.DataFromModel) ; \n--      RxStim.Error := std_logic_vector(UartRxRec.ParamFromModel) ; \n      RxStim.Data  := SafeResize(UartRxRec.DataFromModel, RxStim.Data'length) ; \n      RxStim.Error := SafeResize(UartRxRec.ParamFromModel, RxStim.Error'length) ; \n      AffirmIf(osvvm_UART.UartTbPkg.Match(RxStim, ExpectStim), \n        \"Received: \" & to_string(RxStim), \n        \".  Expected: \" & to_string(ExpectStim) ) ;\n    end loop ;\n    AffirmIf(GetAlertCount = 4, \"Expecting 4 Errors\") ; \n    GetTransactionCount(UartRxRec, TransactionCount) ;\n    AffirmIfEqual(UartRxID, TransactionCount, 15, \"Transaction Count\") ;\n    GetErrorCount(UartRxRec, ErrorCount) ;\n    AffirmIfEqual(UartRxID, ErrorCount, 4, \"Expecting 4 Errors,\") ;\n    \n    for i in 1 to 5 loop     \n      case i is\n        when 1 =>  ExpectStim := (X\"80\", UARTTB_NO_ERROR) ;\n        when 2 =>  ExpectStim := (X\"81\", UARTTB_PARITY_ERROR) ;\n        when 3 =>  ExpectStim := (X\"82\", UARTTB_STOP_ERROR) ;\n        when 4 =>  ExpectStim := (X\"83\", UARTTB_PARITY_ERROR + UARTTB_STOP_ERROR) ;\n        when 5 =>  ExpectStim := (X\"00\", UARTTB_BREAK_ERROR) ;\n      end case ; \n      -- Check with two parameters\n      Check(UartRxRec, ExpectStim.Data, ExpectStim.Error) ;\n    end loop ;\n\n    --\n    ------------------------------------------------------------\n    -- End of test.  Wait for outputs to propagate and signal TestDone\n    wait for 4 * UART_BAUD_PERIOD_115200 ;\n    WaitForBarrier(TestDone) ;\n    wait ;\n  end process UartTbRxProc ;\n\nend SendGet1 ;\nConfiguration TbUart_SendGet1 of TbUart is\n  for TestHarness\n    for TestCtrl_1 : TestCtrl\n      use entity work.TestCtrl(SendGet1) ; \n    end for ; \n  end for ; \nend TbUart_SendGet1 ; ","lang":"vhdl"};
processSrcData(g_data);