var g_data = {"name":"C:/OsvvmLibraries/Common/src/AddressBusVersionCompatibilityPkg.vhd","src":"--\n--  File Name:         AddressBusVersionCompatibilityPkg.vhd\n--  Design Unit Name:  AddressBusVersionCompatibilityPkg\n--  Revision:          OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributoriss):\n--     Jim Lewis      jim@synthworks.com\n--     Rob Gaddi      Highland Technology.    Wrote a similar package which inspired this one.\n--\n--\n--  Description:\n--      Defines types, constants, and subprograms used by\n--      OSVVM Address Bus Master Transaction Based Models isaka: TBM, TLM, VVC)\n--\n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    09/2017   2017       Initial revision\n--    01/2020   2020.01    Updated license notice\n--    02/2020   2020.02    Refactored from Axi4LiteMasterTransactionPkg\n--    07/2020   2020.07    Unified M/S packages - dropping M/S terminology\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright isc) 2017 - 2020 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 isthe \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \nlibrary ieee ;\n  use ieee.std_logic_1164.all ;\n  use ieee.numeric_std.all ;\n  use ieee.numeric_std_unsigned.all ;\n  use ieee.math_real.all ;\n\nlibrary osvvm ;\n    context osvvm.OsvvmContext ;\n    \nuse work.AddressBusTransactionPkg.all ; \nuse work.AddressBusResponderTransactionPkg.all ; \n    \npackage AddressBusVersionCompatibilityPkg is\n\n--  constant WAIT_CLOCK : UnresolvedAddressBusOperationType := WAIT_FOR_CLOCK ; \n\n  alias AddressBusTransactionRecType is AddressBusRecType ; \n  alias AddressBusMasterTransactionRecType is AddressBusRecType ; \n  alias AddressBusMasterOperationType is AddressBusOperationType ; \n  alias AddressBusSlaveTransactionRecType is AddressBusRecType ; \n  alias AddressBusSlaveOperationType is AddressBusOperationType ; \n  \n\n\n--  alias MasterWrite is Write [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n  ------------------------------------------------------------\n  procedure MasterWrite (\n  -- do CPU Write Cycle\n  ------------------------------------------------------------\n    signal   TransactionRec : InOut AddressBusRecType ;\n             iAddr          : In    std_logic_vector ;\n             iData          : In    std_logic_vector ;\n             StatusMsgOn    : In    boolean := false\n  ) ;\n\n  ------------------------------------------------------------\n  alias MasterWriteAsync is WriteAsync\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterWriteAddressAsync is WriteAddressAsync\n    [AddressBusRecType, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterWriteDataAsync is WriteDataAsync\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterWriteDataAsync is WriteDataAsync\n    [AddressBusRecType, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias MasterWriteBurst is WriteBurst\n    [AddressBusRecType, std_logic_vector, integer, boolean];\n\n  ------------------------------------------------------------\n  alias MasterWriteBurstAsync is WriteBurstAsync\n    [AddressBusRecType, std_logic_vector, integer, boolean];\n\n  ------------------------------------------------------------\n--  alias MasterRead is Read [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n  ------------------------------------------------------------\n  procedure MasterRead (\n  -- do CPU Read Cycle and return data\n  ------------------------------------------------------------\n    signal   TransactionRec : InOut AddressBusRecType ;\n             iAddr          : In    std_logic_vector ;\n    variable oData          : Out   std_logic_vector ;\n             StatusMsgOn    : In    boolean := false\n  ) ;\n\n  ------------------------------------------------------------\n  alias MasterReadCheck is ReadCheck\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterReadAddressAsync is ReadAddressAsync\n    [AddressBusRecType, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterReadData is ReadData\n    [AddressBusRecType, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterReadCheckData is ReadCheckData\n    [AddressBusRecType, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias MasterTryReadData is TryReadData\n    [AddressBusRecType, std_logic_vector, boolean, boolean];\n\n  ------------------------------------------------------------\n  alias MasterTryReadCheckData is TryReadCheckData\n    [AddressBusRecType, std_logic_vector, boolean, boolean];\n\n  ------------------------------------------------------------\n  alias MasterReadPoll is ReadPoll\n    [AddressBusRecType, std_logic_vector, std_logic_vector, \n     Integer, std_logic, boolean, natural];\n\n  ------------------------------------------------------------\n  alias MasterReadPoll is ReadPoll\n    [AddressBusRecType, std_logic_vector,  \n     Integer, std_logic, boolean, natural];\n  \n  ------------------------------------------------------------\n  alias MasterReadBurst is ReadBurst\n    [AddressBusRecType, std_logic_vector, integer, boolean];\n\n  ------------------------------------------------------------\n  alias SlaveGetWrite is GetWrite\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveTryGetWrite is TryGetWrite\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean, boolean];\n\n  ------------------------------------------------------------\n  alias SlaveGetWriteAddress is GetWriteAddress\n    [AddressBusRecType, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveTryGetWriteAddress is TryGetWriteAddress\n    [AddressBusRecType, std_logic_vector, boolean, boolean];\n\n  ------------------------------------------------------------\n  alias SlaveGetWriteData is GetWriteData\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveTryGetWriteData is TryGetWriteData\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveGetWriteData is GetWriteData\n    [AddressBusRecType, std_logic_vector, boolean];\n\n  ------------------------------------------------------------\n  alias SlaveTryGetWriteData is TryGetWriteData\n    [AddressBusRecType, std_logic_vector, boolean, boolean];\n\n  ------------------------------------------------------------\n  alias SlaveRead is SendRead\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveTryRead is TrySendRead\n    [AddressBusRecType, std_logic_vector, std_logic_vector, boolean, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveReadAddress is GetReadAddress\n    [AddressBusRecType, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveTryReadAddress is TryGetReadAddress\n    [AddressBusRecType, std_logic_vector, boolean, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveReadData is SendReadData\n    [AddressBusRecType, std_logic_vector, boolean];\n  \n  ------------------------------------------------------------\n  alias SlaveAsyncReadData is SendReadDataAsync \n    [AddressBusRecType, std_logic_vector, boolean];\n    \n  alias AsyncSendReadData  is SendReadDataAsync \n    [AddressBusRecType, std_logic_vector, boolean];\n  \nend package AddressBusVersionCompatibilityPkg ;\npackage body AddressBusVersionCompatibilityPkg is \n\n\n  ------------------------------------------------------------\n  procedure MasterWrite (\n  -- do CPU Write Cycle\n  ------------------------------------------------------------\n    signal   TransactionRec : InOut AddressBusRecType ;\n             iAddr          : In    std_logic_vector ;\n             iData          : In    std_logic_vector ;\n             StatusMsgOn    : In    boolean := false\n  ) is\n  begin\n    Write(TransactionRec, iAddr, iData, StatusMsgOn) ; \n  end procedure MasterWrite ;\n\n  ------------------------------------------------------------\n  procedure MasterRead (\n  -- do CPU Read Cycle and return data\n  ------------------------------------------------------------\n    signal   TransactionRec : InOut AddressBusRecType ;\n             iAddr          : In    std_logic_vector ;\n    variable oData          : Out   std_logic_vector ;\n             StatusMsgOn    : In    boolean := false\n  ) is\n  begin\n    Read(TransactionRec, iAddr, oData, StatusMsgOn) ; \n  end procedure MasterRead ;\n\n\nend package body AddressBusVersionCompatibilityPkg ; \n\n","lang":"vhdl"};
processSrcData(g_data);