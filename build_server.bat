rmdir "test_server/VioletThunder" /s /q 
xcopy "VioletThunder" "test_server/VioletThunder" /s /e /y /i
cd ./test_server
npm install && npm start