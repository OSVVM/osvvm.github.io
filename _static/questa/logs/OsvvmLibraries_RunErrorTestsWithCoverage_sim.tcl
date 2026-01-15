vmap   osvvm  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm
vmap   osvvm_common  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_common
vmap   osvvm_common  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_common
vmap   osvvm_uart  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_uart
vmap   osvvm_axi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_axi4
vmap   osvvm_axi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_axi4
vmap   osvvm_axi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_axi4
vmap   osvvm_axi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_axi4
vmap   osvvm_dpram_pt  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_dpram_pt
vmap   osvvm_dpram  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_dpram
vmap   osvvm_ethernet  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_ethernet
vmap   osvvm_videobus  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_videobus
vmap   osvvm_spi  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_spi
vmap   osvvm_cosim  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_cosim
vmap   osvvm_cosim  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_cosim
vmap   osvvm_tbaxi4lite  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxi4lite
vmap   osvvm_tbaxi4lite  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxi4lite
vsim -t ps -lib osvvm_TbAxi4Lite TbAxi4_RandomReadWrite -quiet -coverage -suppress 8683 -suppress 8684 
vlib   C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxi4 
vmap   osvvm_tbaxi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxi4
vmap   osvvm_tbaxi4  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxi4
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_DemoMemoryReadWrite1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_DemoErrorMemoryReadWrite1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_ManagerRandomTiming1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_ManagerMemoryRandomTiming1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_MemoryBurstPattern1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_DemoErrorMemoryReadWrite1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxi4 TbAxi4_DemoMemoryReadWrite1 -quiet -coverage -suppress 8683 -suppress 8684 
vlib   C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxistream 
vmap   osvvm_tbaxistream  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxistream
vmap   osvvm_tbaxistream  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbaxistream
vsim -t ps -lib osvvm_TbAxiStream TbStream_SendGetDemo1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxiStream TbStream_SendGetPacketBurst1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxiStream TbStream_SendGetRandom1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib osvvm_TbAxiStream TbStream_SendGetRandom2 -quiet -coverage -suppress 8683 -suppress 8684 
vlib   C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbuart 
vmap   osvvm_tbuart  C:/tools/VHDL_LIBS/QuestaSim-2023.10/osvvm_tbuart
vlib   C:/tools/VHDL_LIBS/QuestaSim-2023.10/tbuart 
vmap   tbuart  C:/tools/VHDL_LIBS/QuestaSim-2023.10/tbuart
vsim -t ps -lib TbUart TbUart_SendGet1 -quiet -coverage -suppress 8683 -suppress 8684 
vlib   C:/tools/VHDL_LIBS/QuestaSim-2023.10/ethernet_teststandalone 
vmap   ethernet_teststandalone  C:/tools/VHDL_LIBS/QuestaSim-2023.10/ethernet_teststandalone
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 -gMII_BPS=BPS_1G -gMII_INTERFACE=RGMII 
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 -gMII_BPS=BPS_100M -gMII_INTERFACE=MII 
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 -gMII_BPS=BPS_10M -gMII_INTERFACE=MII 
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 -gMII_BPS=BPS_100M -gMII_INTERFACE=RMII 
vsim -t ps -lib Ethernet_TestStandAlone Tb_xMii1 -quiet -coverage -suppress 8683 -suppress 8684 -gMII_BPS=BPS_10M -gMII_INTERFACE=RMII 
