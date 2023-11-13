
// OLED 128 x 64 디스플레이 
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// WiFi헤더를 포함하고 있다.
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>

// 자이로 6축 센서 
#include <MPU6050_light.h>
// JSON 처리
#include <ArduinoJson.h>

// 검출 딜레이 속도
int DELAY_GYRO = 10; // 0.1초 지나면 감지
// 와이파이 설정
const char* ssid = "enkino_2G";
const char* password = "**************"; // 공유기 비번으로 대체하기
const char* mqtt_server = "192.168.219.199"; // MQTT 서버의 IP 주소
int mqtt_port = 1883;

unsigned long timer = 0;
// OLED에 카운트 증가시키면서 보여주는 용도
int count = 0;

// 센서 초기화
MPU6050 mpu(Wire);

// MQTT
// ESP8266WiFiClass Wifi8266; // 맥 어드레스는 얻기 위함 
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(2000)
char msg[MSG_BUFFER_SIZE];
char receive_msg[MSG_BUFFER_SIZE];
char mac_addr[13]; // 12자 + 1 byte (NULL)


unsigned int temp_hud_millis = 0; // millis()는 unsigned int , 50일 지나면 0으로 오버플로우 됨
int angle_x = 0;
int angle_y = 0;

// Create a random client ID
// String clientId = "ESP8266Client-";
String clientId = "gyro1-";
String clientSubscribeCommandTopic = "cmd/gyro1-";

// MQTT를 통해 데이터 수신 시 호출
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    receive_msg[i] = (char)payload[i];
  }
  receive_msg[length] = '\0';
  Serial.println();

  // payload: 
  // {
  // "uuid" : uuid,
  // "relay_name" : "gyro",
  // "relay_value": 1
  // }
  // Deserialize the JSON document : Json문서 분석
  DynamicJsonDocument doc(1000);
  DeserializationError error = deserializeJson(doc, receive_msg);
 
  // Test if parsing succeeds. : 파싱 에러 발생 시 출력
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  const char* uuid = doc["uuid"];
  const char* relay_name = doc["relay_name"];
  const int relay_value = doc["relay_value"];

  Serial.println(uuid);
  Serial.println(relay_name);
  Serial.println(relay_value);
  Serial.println(strcmp(relay_name,"gyro"));

  // if (strcmp(relay_name,"gyro")==0) { // 일치하면
  //   gyro = relay_value;
  //   if (gyro==1)
  //     digitalWrite(RELAY_PIN, HIGH);
  //   else if (gyro==0)
  //     digitalWrite(RELAY_PIN, LOW);

  //   // 결과 리턴 
  // }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    Serial.println(clientSubscribeCommandTopic);

    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe(clientSubscribeCommandTopic.c_str());
      // client.publish("response", "");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // OLED
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Show initial display buffer contents on the screen --
  // the library initializes this with an Adafruit splash screen.
  display.display();
  delay(1000); // Pause for 2 seconds

  // Clear the buffer
  display.clearDisplay();
  display.display();
  delay(1);
  testdrawchar();

  
  // MQTT 메시지 초기화
  receive_msg[0] = '\0';
  // MPU 초기화
  byte status = mpu.begin();
  delay(1000);
  Serial.print(F("MPU6050 status: "));
  Serial.println(status);
  while(status!=0){ 
    status = mpu.begin();
    delay(1000);
  } // stop everything if could not connect to MPU6050
  
  Serial.println(F("Calculating offsets, do not move MPU6050"));
  delay(1000);
  mpu.calcOffsets(true,true); // gyro and accelero
  Serial.println("Done!\n");
  Serial.println("");


  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // 와이파이 연결시까지 대기
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
 
  // Print the IP address
  Serial.print("Local IP : ");
  Serial.println(WiFi.localIP());
  Serial.println("");
  
  String macID = WiFi.macAddress();
  macID.replace(":","");
  macID.toCharArray(mac_addr, 13);
  clientId += String(mac_addr); // MQTT 클라이언트용 고유 id 생성
  clientSubscribeCommandTopic += String(mac_addr); // 커맨드 받는 토픽 주소

  Serial.print("mac : ");
  Serial.println(mac_addr); // E8:DB:84:98:6E:61
  Serial.println("");

  // MQTT 설정
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  
  // 시간 초기화
  temp_hud_millis = millis();
}

void loop() {
  // MQTT 연결
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  mpu.update();

  // 센서 딜레이 시간마다 측정
  if ( millis() - temp_hud_millis > DELAY_GYRO) {
    angle_x = mpu.getAngleX();
    angle_y = mpu.getAngleY();
    Serial.print("X: ");
    Serial.print(angle_x);
    Serial.print(" Y: ");
    Serial.print(angle_y);
    Serial.print(" count: ");
    Serial.println(count);
    temp_hud_millis = millis();

    // 최초 1회 센서값은 부정확 하므로 전달하지 않음
    if (count>0) {
      // 직렬화  힙에 저장된 JSON 문서를 직렬화
      DynamicJsonDocument doc2(2000); //<- 예상 보다 조금 더 많게 스택 설정.
      doc2["id"] = clientId;
      doc2["0"] = angle_x;
      doc2["1"] = angle_y;
      doc2["2"] = random(1,1000);
      doc2["3"] = count;

      String jsonData="";
      serializeJson(doc2, jsonData); 
      serializeJson(doc2, msg, 2000);
      // 서버로 송신
      client.publish("telemetry", msg);
    }
    count += 1;

    if (count>1000)
      count = 0;
  }
  // 각도 X,Y 저장
  display.clearDisplay();
  display.setCursor(0,0);
  display.print(F("X:"));
  display.print(angle_x);

  display.setCursor(0, 20);
  display.print("Y:");
  display.print(angle_y);

  display.setCursor(0, 40);
  display.print("count:");
  display.print(count);
  display.display();
  delay(1);
}


void testdrawchar(void) {
  display.clearDisplay();

  display.setTextSize(2);      // Normal 1:1 pixel scale
  display.setTextColor(WHITE); // Draw white text
  display.setCursor(0, 0);     // Start at top-left corner
  display.cp437(true);         // Use full 256 char 'Code Page 437' font

  display.display();
  delay(1);
}