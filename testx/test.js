const _ = require('lodash');
// let alarms_list = [{
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:38:09",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331301,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:38:39",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331302,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:39:09",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331303,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:39:39",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331304,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:38:05",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331615,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:38:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331616,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:39:05",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331617,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:39:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16331618,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:37:08",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332019,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:37:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332020,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:38:08",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332021,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:38:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332022,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:40:09",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332942,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:40:39",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332943,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:41:09",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332944,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1641101244",
// 			"DataTime": "2018-04-08 21:41:39",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16332945,
// 			"UpdateTime": "2018-04-08 21:46:31",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 113.84671,
// 			"Latitude": 22.808644,
// 			"GPSTime": "2018-04-08 21:39:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:40:05",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333367,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:40:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333368,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:05",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333369,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333370,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:30"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:39:08",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333913,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:39:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333914,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:08",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333915,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16333916,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:40:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16334917,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.602668,
// 			"Latitude": 31.529195,
// 			"GPSTime": "2018-04-08 21:41:35"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16334918,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.602684,
// 			"Latitude": 31.529283,
// 			"GPSTime": "2018-04-08 21:42:35"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16334919,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.602773,
// 			"Latitude": 31.529291,
// 			"GPSTime": "2018-04-08 21:43:35"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1635101810",
// 			"DataTime": "2018-04-08 21:41:35",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16334920,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.60281,
// 			"Latitude": 31.529273,
// 			"GPSTime": "2018-04-08 21:44:35"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:35:56",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335378,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:36:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335379,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:36:56",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335380,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:37:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335381,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335558,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:41:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335559,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:42:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335560,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:43:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100308",
// 			"DataTime": "2018-04-08 21:40:38",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16335561,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.503573,
// 			"Latitude": 31.34851,
// 			"GPSTime": "2018-04-08 21:44:38"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:37:56",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16336746,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:38:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16336747,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:38:56",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16336748,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:39:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16336749,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258873,
// 			"Latitude": 43.819076,
// 			"GPSTime": "2018-04-08 21:40:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:36:30",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337081,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:37:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337082,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:37:30",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337083,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:38:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337084,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:39:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337537,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258753,
// 			"Latitude": 43.819151,
// 			"GPSTime": "2018-04-08 21:41:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:39:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337538,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258798,
// 			"Latitude": 43.819071,
// 			"GPSTime": "2018-04-08 21:42:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:39:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337539,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258701,
// 			"Latitude": 43.819004,
// 			"GPSTime": "2018-04-08 21:43:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632101011",
// 			"DataTime": "2018-04-08 21:39:26",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16337540,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 125.258624,
// 			"Latitude": 43.819108,
// 			"GPSTime": "2018-04-08 21:44:46"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:38:30",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16338925,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:39:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16338926,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:39:30",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16338927,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:40:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16338928,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:39:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:40:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16340641,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:40:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:40:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16340642,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:41:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:40:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16340643,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:42:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100376",
// 			"DataTime": "2018-04-08 21:40:00",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16340644,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:43:29"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100893",
// 			"DataTime": "2018-04-08 21:35:45",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16341131,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.924831,
// 			"Latitude": 30.909365,
// 			"GPSTime": "2018-04-08 21:41:01"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100893",
// 			"DataTime": "2018-04-08 21:36:15",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16341132,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.924831,
// 			"Latitude": 30.909365,
// 			"GPSTime": "2018-04-08 21:41:01"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100893",
// 			"DataTime": "2018-04-08 21:36:45",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16341133,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.924831,
// 			"Latitude": 30.909365,
// 			"GPSTime": "2018-04-08 21:41:01"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1627100893",
// 			"DataTime": "2018-04-08 21:37:15",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16341134,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 121.924831,
// 			"Latitude": 30.909365,
// 			"GPSTime": "2018-04-08 21:41:01"
// 		}
// 	}, {
// 		"$set": {
// 			"CurDay": "2018-04-09",
// 			"DeviceId": "1632100726",
// 			"DataTime": "2018-04-08 21:37:04",
// 			"warninglevel": "",
// 			"NodeID": "9999",
// 			"SN64": 16341233,
// 			"UpdateTime": "2018-04-08 21:46:32",
// 			"organizationid": "599af5dc5f943819f10509e6",
// 			"Longitude": 0,
// 			"Latitude": 0,
// 			"GPSTime": "2018-04-08 21:41:03"
// 		}
// 	}];
//
// console.log(`->${alarms_list.length}`);
//
// let datasin = alarms_list;
// //先排序,后去重
// datasin = _.sortBy(datasin, [(o)=>{
// 	const key = `${o["$set"].DeviceId}_${o["$set"].DataTime}`;
// 	console.log(key);
// 	return key;
// }]);
// console.log(`after sortBy dbh_alarm->count:${datasin.length}`);
//
// datasin = _.sortedUniqBy(datasin,(o)=>{
// 	const key = `${o["$set"].DeviceId}_${o["$set"].DataTime}`;
// 	console.log(key);
// 	return key;
// });
// console.log(`after sortedUniqBy dbh_alarm->count:${datasin.length}`);

// const getpartition = (key)=>{
//   let index = 0;
//   if(typeof key === 'string'){
//     try{
//       index = parseInt(key);
//       index = index%48;
//     }
//     catch(e){
//       index = 0;
//     }
//   }
//   return index;
// }
//
// const p = getpartition('1501103291');
// console.log(p);
const devicedatapile = (data)=>{
  let newdata = data;
  const Alarm = _.get(data,'BMSData.Alarm');
  if(!!Alarm){
    //含有报警
    let AL_TROUBLE_CODE_2 = _.get(data,'BMSData.Alarm.AL_TROUBLE_CODE_2',[]);
    const AL_TROUBLE_CODE = _.get(data,'BMSData.Alarm.AL_TROUBLE_CODE');
    if(!!AL_TROUBLE_CODE){
      _.pull(AL_TROUBLE_CODE_2, AL_TROUBLE_CODE);
      AL_TROUBLE_CODE_2.push(AL_TROUBLE_CODE);
    }    const CANType = _.get(data,'BMSData.CANType',-1);
    let newAlarm = _.clone(Alarm);
    newAlarm = _.omit(newAlarm,['AL_TROUBLE_CODE_2']);
    _.map(AL_TROUBLE_CODE_2,(errcode)=>{
      // const fieldname = getFieldname(CANType,errcode);
      newAlarm[`${errcode}`] = 1;
    });
    _.set(newdata,'BMSData.Alarm',newAlarm);
    _.set(newdata,'BMSData.Alarm.TROUBLE_CODE_LIST',AL_TROUBLE_CODE_2);
    // newdata.TROUBLE_CODE_LIST = AL_TROUBLE_CODE_2;//新增一个字段TROUBLE_CODE_LIST
    console.log(`newdata--->${JSON.stringify(newAlarm)}`);
  }
  return newdata;
}

const data = {
	"Version": "1.0",
	"GUID": "16812318-092B-4B99-AB31-47006BBE86A7",
	"SN64": 49145,
	"DeviceId": "1627100104",
	"DeviceType": 0,
	"BMSData": {
		"CANType": 0,
		"SN16": 172,
		"DataTime": "2018-05-21 16:27:27",
		"RecvTime": "2018-05-21 16:36:36",
		"Alarm": {
			"AL_HEATER_SW": 1,
			"AL_TROUBLE_CODE": 1557,
			"AL_TROUBLE_CODE_2": [880,155,158]
		},
		"BAT_U_OUT_HVS": 629.2,
		"BAT_U_TOT_HVS": 629.7,
		"BAT_I_HVS": 5.6,
		"BAT_SOC_HVS": 56,
		"BAT_SOH_HVS": 100,
		"BAT_UCELL_MAX": 3.3,
		"BAT_UCELL_MIN": 3.3,
		"BAT_UCELL_MAX_CSC": 27,
		"BAT_UCELL_MAX_CELL": 6,
		"BAT_UCELL_MIN_CSC": 15,
		"BAT_UCELL_MIN_CELL": 1,
		"BAT_T_MAX": 28,
		"BAT_T_MIN": 23,
		"BAT_T_AVG": 24,
		"BAT_T_MAX_CSC": 32,
		"BAT_T_MIN_CSC": 17,
		"BAT_USER_SOC_HVS": 58,
		"BAT_UCELL_AVG": 3.3,
		"ALIV_ST_SW_HVS": 1,
		"ST_AC_SW_HVS": 0,
		"ST_AUX_SW_HVS": 0,
		"ST_MAIN_NEG_SW_HVS": 1,
		"ST_PRE_SW_HVS": 0,
		"ST_MAIN_POS_SW_HVS": 1,
		"ST_CHG_SW_HVS": 0,
		"ST_FAN_SW_HVS": 0,
		"ST_HEATER_SW_HVS": 0,
		"BAT_U_HVS": 628.9,
		"BAT_ALLOW_DISCHARGE_I": 400.0,
		"BAT_ALLOW_CHARGE_I": 400.0,
		"BAT_ISO_R_POS": 10351,
		"BAT_ISO_R_NEG": 9382,
		"KEYONVOLTAGE": 26.8,
		"POWERVOLTAGE": 26.2,
		"CHARGEACVOLTAGE": 0.4,
		"CHARGEDCVOLTAGE": 0.4,
		"CC2VOLTAGE": 26.2,
		"CHARGEDCAPACITY": 0,
		"TOTALWORKCYCLE": 381.0,
		"CSC_POWER_CURRENT": 1020,
		"BAT_MAX_SOC_HVS": 57,
		"BAT_MIN_SOC_HVS": 55,
		"BAT_WEI_SOC_HVS": 56,
		"BAT_CHG_AMPERREQ": 0.0,
		"BPM_24V_UOUT": 0.0,
		"ST_NEGHEATER_SW_HVS": 0,
		"ST_WIRELESSCHG_SW": 0,
		"ST_SPEARCHG_SW_2": 0,
		"ST_POWERGRIDCHG_SW": 0,
		"CC2VOLTAGE_2": 26.2
	}
};

const newdata = devicedatapile(data);
console.log(JSON.stringify(newdata));
