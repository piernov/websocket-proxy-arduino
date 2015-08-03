#include "Arduino.h"

// Serial commands
#define SET_PIN_OUTPUT 'o'
#define SET_PIN_INPUT 'i'
#define SET_PIN_HIGH 'h'
#define SET_PIN_LOW 'l'

#define STATE_WAITING 'w' // default state
#define STATE_COMMAND 'c' // processing command
#define STATE_EXEC 'e' // exec command

char state;
char command;
char arg;

void setup() {
	Serial.begin(115200);
	state = STATE_WAITING;
}

void loop() {
	/*  check if data has been sent from the computer: */
	if (Serial.available() || state == STATE_EXEC) {

		if(state == STATE_WAITING)
			command = Serial.read();

		switch (command)
		{
			case SET_PIN_OUTPUT:
			{
				if(state == STATE_EXEC)
				{
					pinMode(arg, OUTPUT);
					goto end;
				}
				else
					goto parse;
				break;
			}
			case SET_PIN_INPUT:
			{
				if(state == STATE_EXEC)
				{
					pinMode(arg, INPUT);
					goto end;
				}
				else
					goto parse;
				break;
			}
			case SET_PIN_HIGH:
			{
				if(state == STATE_EXEC)
				{
					digitalWrite(arg, HIGH);
					goto end;
				}
				else
					goto parse;
				break;
			}
			case SET_PIN_LOW:
			{
				if(state == STATE_EXEC)
				{
					digitalWrite(arg, LOW);
					goto end;
				}
				else
					goto parse;
				break;
			}

			parse:
			{
				switch (state)
				{
					case STATE_WAITING:
					{
						state = STATE_COMMAND;
						break;
					}
					case STATE_COMMAND:
					{
						arg = Serial.read()-64;
						state = STATE_EXEC;
						break;
					}
				}
				break;
			}

			end:
			{
				char *debugstr;
				debugstr = new char[5];
				strncpy(debugstr, &state, 1);
				strncat(debugstr, &command, 1);
				strncat(debugstr, &arg, 1);
				Serial.println(debugstr);
				delete debugstr;
				state = STATE_WAITING;
				break;
			}

			default:
			{
				state = STATE_WAITING;
				Serial.println("Error: invalid command");
				break;
			}
		}
	}
}

