var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/osvvm/VendorCovApiPkg.vhd","src":"--\n--  File Name:         VendorCovApiPkg.vhd\n--  Design Unit Name:  VendorCovApiPkg\n--  Revision:          STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--\n--  Based on work done in package VendorCovApiPkg_Aldec.vhd by:\n--     ...\n--\n--\n--  Package Defines\n--     A set of foreign procedures that link OSVVM's CoveragePkg\n--     coverage model creation and coverage capture with the \n--     built-in capability of a simulator.\n--\n--\n--  Revision History:      For more details, see CoveragePkg_release_notes.pdf\n--    Date      Version    Description\n--    11/2016   2016.11    Initial revision\n--    01/2020   2020.01    Updated Licenses to Apache\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2016 - 2020 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \n\n\npackage VendorCovApiPkg is\n\n  subtype VendorCovHandleType is integer;\n    \n    -- Types for how coverage bins are represented.  Matches OSVVM types.\n  type VendorCovRangeType is record\n      min: integer;\n      max: integer;\n    end record;\n    \n  type VendorCovRangeArrayType is array ( integer range <> ) of VendorCovRangeType;\n\n  --  Create Initial Data Structure for Point/Item Functional Coverage Model\n  --  Sets initial name of the coverage model if available\n  impure function VendorCovPointCreate( name: string ) return VendorCovHandleType;\n    \n  --  Create Initial Data Structure for Cross Functional Coverage Model\n  --  Sets initial name of the coverage model if available\n  impure function VendorCovCrossCreate( name: string ) return VendorCovHandleType;\n    \n  --  Sets/Updates the name of the Coverage Model.\n  --  Should not be called until the data structure is created by VendorCovPointCreate or VendorCovCrossCreate.\n  --  Replaces name that was set by VendorCovPointCreate or VendorCovCrossCreate.\n  procedure VendorCovSetName( obj: VendorCovHandleType; name: string );\n\n  --  Add a bin or set of bins to either a Point/Item or Cross Functional Coverage Model\n  --  Checking for sizing that is different from original sizing already done in OSVVM CoveragePkg\n  --  It is important to maintain an index that corresponds to the order the bins were entered as \n  --  that is used when coverage is recorded.\n  procedure VendorCovBinAdd( obj: VendorCovHandleType; bins: VendorCovRangeArrayType; Action: integer; atleast: integer; name: string );\n    \n  --  Increment the coverage of bin identified by index number.\n  --  Index ranges from 1 to Number of Bins.  \n  --  Index corresponds to the order the bins were entered (starting from 1)\n  procedure VendorCovBinInc( obj: VendorCovHandleType; index: integer );\n\n\nend package;\n\npackage body VendorCovApiPkg is\n  --  Create Initial Data Structure for Point/Item Functional Coverage Model\n  --  Sets initial name of the coverage model if available\n	impure function VendorCovPointCreate( name: string ) return VendorCovHandleType is\n  begin\n    return 0 ; \n  end function VendorCovPointCreate ;\n    \n  --  Create Initial Data Structure for Cross Functional Coverage Model\n  --  Sets initial name of the coverage model if available\n	impure function VendorCovCrossCreate( name: string ) return VendorCovHandleType is\n  begin\n    return 0 ; \n  end function VendorCovCrossCreate ;\n    \n  --  Sets/Updates the name of the Coverage Model.\n  --  Should not be called until the data structure is created by VendorCovPointCreate or VendorCovCrossCreate.\n  --  Replaces name that was set by VendorCovPointCreate or VendorCovCrossCreate.\n	procedure VendorCovSetName( obj: VendorCovHandleType; name: string ) is \n  begin\n  end procedure VendorCovSetName ;\n    \n  --  Add a bin or set of bins to either a Point/Item or Cross Functional Coverage Model\n  --  Checking for sizing that is different from original sizing already done in OSVVM CoveragePkg\n  --  It is important to maintain an index that corresponds to the order the bins were entered as \n  --  that is used when coverage is recorded.\n	procedure VendorCovBinAdd( obj: VendorCovHandleType; bins: VendorCovRangeArrayType; Action: integer; atleast: integer; name: string )is \n  begin\n  end procedure VendorCovBinAdd ;\n    \n  --  Increment the coverage of bin identified by index number.\n  --  Index ranges from 1 to Number of Bins.  \n  --  Index corresponds to the order the bins were entered (starting from 1)\n	procedure VendorCovBinInc( obj: VendorCovHandleType; index: integer )is \n  begin\n  end procedure VendorCovBinInc ;\n    \nend package body VendorCovApiPkg ;\n","lang":"vhdl"};
processSrcData(g_data);