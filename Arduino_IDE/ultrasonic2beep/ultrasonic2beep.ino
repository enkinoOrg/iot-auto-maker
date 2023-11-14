
#include <Wire.h>

#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>

// #define BEEP_PIN 7

#define TRIGGER_PIN D5 
#define ECHO_PIN D6 

hd44780_I2Cexp lcd;
int count = 0;

void setup() {
  // 초기화
  
  Serial.begin(115200);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  // pinMode(BEEP_PIN, OUTPUT);
  
  lcd.init(); 
  lcd.clear();      
  lcd.backlight();   
  lcd.begin(16,2);
}

void loop() {
  
  float duration, distance;

  digitalWrite(TRIGGER_PIN, HIGH);
  delay(1);
  digitalWrite(TRIGGER_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = ((float) (duration * 340) / 10000) /2;

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("DIST : ");
  lcd.print((int)distance);

  delay(100);

  Serial.println(distance);

  if (distance <= 0) {
    // noTone(BEEP_PIN);
    delay(50);    
  }
  else if (distance < 5) {
    // tone(BEEP_PIN, 987);
    lcd.setCursor(0,1);
    lcd.write(219);
    delay(50);
  } else if (distance < 30) {
    int loop1 = (int)((distance + 10) / 5);
    lcd.setCursor(0,1);
    for (int i=0;i<distance/2;i++) {
      // lcd.print("O");
      lcd.write(219);
    }
    
    // 523 = C (도)
    // tone(BEEP_PIN, 523);
    delay(50);

    for (int i=0;i<loop1;i++) {
      // noTone(BEEP_PIN);
      delay(75);
    }
  } else {
    // noTone(BEEP_PIN);
    lcd.setCursor(0,1);
    for (int i=0;i<16;i++) {
      lcd.write(219);
    }
    delay(200);
  }
}
