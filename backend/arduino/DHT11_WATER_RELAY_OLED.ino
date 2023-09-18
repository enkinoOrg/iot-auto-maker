#include <SimpleDHT.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>
#include <ArduinoJson.h>

#include <Adafruit_GFX.h>           // adafruit의 그래픽 관련 라이브러리
#include <Adafruit_SSD1306.h>        // ssd1306 제어용 라이브러리

#define SCREEN_WIDTH 128              // OLED 디스플레이의 가로 픽셀수
#define SCREEN_HEIGHT 64              // OLED 디스플레이의 세로 픽셀수

#define OLED_RESET     -1             // 리셋핀이 있는 oled의 리셋핀에 연결할 아두이노의 핀 번호, 리셋핀이 없는 모듈은 임의의 숫자를 넣어도 됨.
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);    // 디스플레이 객체 생성

// 와이파이 설정
const char* ssid = "enkino_2G";
const char* password = "enkino20110808!";
const char* mqtt_server = "192.168.219.103";
int mqtt_port = 1883;

// for DHT11, 온습도계 설정
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2

int DHT11_PIN = D4;
SimpleDHT11 dht11(DHT11_PIN);
// hd44780_I2Cexp lcd; // LCD

// 수분감지센서
// int HUMIDITY_PIN = A0;
${sensor}

// 릴레이
// int RELAY_PIN = D7;
// int water_pump = 0;
${relay}

// MQTT
ESP8266WiFiClass Wifi8266; // 맥 어드레스는 얻기 위함
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (2000)
char msg[MSG_BUFFER_SIZE];
char receive_msg[MSG_BUFFER_SIZE];
char mac_addr[13]; // 12+1 (NULL)

byte temperature = 0;
byte humidity = 0;
byte humidity2 = 0;

int DELAY_TEMP_HUD = 1500; // 1.5초 지나면 감지
unsigned int temp_hud_millis = 0; // millis()는 unsigned int , 50일 지나면 0으로 오버플로우 됨
int DELAY_HUD2 = 1000; // 1초에 감지
unsigned int temp_hud2_millis = 0; // millis()는 unsigned int , 50일 지나면 0으로 오버플로우 됨

// Create a random client ID
// String clientId = "ESP8266Client-";
String clientId = "water1-";
String clientSubscribeCommandTopic = "cmd/water1-";

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
  // "relay_name" : "water_pump",
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
  Serial.println(strcmp(relay_name,"water_pump"));

  if (strcmp(relay_name,"water_pump")==0) { // 일치하면
    water_pump = relay_value;
    if (water_pump==1)
      digitalWrite(RELAY_PIN, HIGH);
    else if (water_pump==0)
      digitalWrite(RELAY_PIN, LOW);

    // 결과 리턴
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    Serial.println(clientSubscribeCommandTopic);


    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // ... and resubscribe
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

void clear_oled(void) {
  display.clearDisplay();

  display.setTextSize(1);             // Normal 1:1 pixel scale
  display.setTextColor(WHITE);
  display.setCursor(0, 0);  // Draw white text
               // Start at top-left corner
  display.display();
}


void setup() {
  // 0x3C주소로 디스플레이 장치를 초기화
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  // MQTT
  receive_msg[0] = '\0';
  delay(10);
  Serial.begin(115200);

  // OLED 화면 지움
  clear_oled();

  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);


  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  display.print("WIFI connecting ");
  display.display();

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    display.print(".");
    display.display();
  }
  Serial.println("");
  clear_oled();

  // Print the IP address
  Serial.print("Local IP : ");
  Serial.println(WiFi.localIP());
  Serial.println("");

  display.print("IP : ");
  display.println(WiFi.localIP());
  display.println("");
  display.display();


  String macID = Wifi8266.macAddress();
  macID.replace(":","");
  macID.toCharArray(mac_addr, 13);
  clientId += String(mac_addr); // MQTT 클라이언트용 고유 id 생성
  clientSubscribeCommandTopic += String(mac_addr); // 커맨드 받는 토픽 주소

  Serial.print("mac : ");
  Serial.println(mac_addr); // E8:DB:84:98:6E:61
  Serial.println("");

  display.println(mac_addr);
  display.display();

  // 릴레이 끄기 - 초기화
  water_pump = 0;
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  // MQTT 설정
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  delay(1500);


  // 시간 초기화
  temp_hud_millis = millis();
  temp_hud2_millis = millis();

}

void loop() {
  // MQTT 연결
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // 센서 딜레이 시간마다 측정
  if ( millis() - temp_hud_millis > DELAY_TEMP_HUD) {
    byte temperature_temp = 0;
    byte humidity_temp = 0;
    int err = SimpleDHTErrSuccess;
    if ((err = dht11.read(&temperature_temp, &humidity_temp, NULL)) != SimpleDHTErrSuccess) {
      // Serial.print("Read DHT11 failed, err="); Serial.print(SimpleDHTErrCode(err));
      // Serial.print(","); Serial.println(SimpleDHTErrDuration(err));
    } else {
      // 값 업데이트
      temperature = temperature_temp;
      humidity = humidity_temp;
    }
   temp_hud_millis = millis();
  //  Serial.print("온도, 습도 : ");
  //  Serial.print((int)temperature); Serial.print(" *C, ");
  //  Serial.print((int)humidity); Serial.println(" H");
  }

  if ( millis() - temp_hud2_millis > DELAY_HUD2) {
    int humidity_temp = analogRead(HUMIDITY_PIN);
    int humidity2 = map(humidity_temp, 1023,512, 0, 100);
    // Serial.print((int)humidity2); Serial.print(" "); Serial.print((int)humidity_temp); Serial.println(" H2");

    if (temperature ==0 && humidity ==0)
      return; // 초기화 중이므로 데이터 표시 안함.

    // LCD에 내용 표시

    clear_oled();
    display.print((int)temperature);
    display.print(" C, ");
    display.print((int)humidity);
    display.print(" H, ");
    display.print((int)humidity2);
    display.println(" MO");
    display.println("");

    display.print("WATER PUMP : ");
    display.setTextSize(2);
    display.println(water_pump==1 ? "ON " : "OFF");
    display.setTextSize(1);
    display.println("");

    display.print("MQTT :");
    display.println(receive_msg);
    display.display();
    temp_hud2_millis = millis();

    // JSON
    // 직렬화  힙에 저장된 JSON 문서를 직렬화
    DynamicJsonDocument doc2(2000); //<- 예상 보다 조금 더 많게 스택 설정.
    doc2["id"] = clientId;
    doc2["0"] = temperature;
    doc2["1"] = humidity;
    doc2["2"] = humidity2;
    doc2["3"] = water_pump;

    String jsonData="";
    serializeJson(doc2, jsonData); // => {"name":"홍길동"}
    // Serial.println(jsonData);
    // serializeJson(doc2, Serial); // => {"name":"홍길동"} 시리얼에 출력
    serializeJson(doc2, msg, 2000); // => {"name":"홍길동"} 시리얼에 출력
    // 서버로 송신
    client.publish("telemetry", msg);


  }

  // 릴레이 작동 여부

  // if (humidity2==0) {
  //   water_pump = 1;
  //   digitalWrite(RELAY_PIN, HIGH);
  // } else if (humidity2>50){
  //   water_pump = 0;
  //   digitalWrite(RELAY_PIN, LOW);
  // }

  //
  // if (water_pump==0)
  //   display.print("Close");
  // else
  //   display.print("Open");


  // DHT11 sampling rate is 1HZ.
  // delay(2000);


}