#!/usr/bin/env lua

local ev = require'ev'
local rs232 = require "rs232"
local json = require "json"

local arduino, e = rs232.port('/dev/ttyUSB0',{
  baud         = '_115200';
  data_bits    = '_8';
  parity       = 'NONE';
  stop_bits    = '_1';
  flow_control = 'OFF';
  rts          = 'ON';
})


print(arduino:open())
print(e)


-- create a copas webserver and start listening
local server = require'websocket'.server.ev.listen
{
  -- listen on port 8080
  port = 8181,
  -- the protocols field holds
  --   key: protocol name
  --   value: callback on new connection
  protocols = {
    -- this callback is called, whenever a new client connects.
    -- ws is a new websocket instance
    echo = function(ws)
      print("Client connected")

      ws:on_message(function(ws,message)
        dec = json.decode(message)
        decmsg = json.decode(dec.msg)
        for k,v in pairs(decmsg) do print(k,v) end
        arduino:write(decmsg.message)
        ws:send(message)
      end)

      ws:on_error(function()
           print("error")
      end)

      ws:on_close(function() print("closed") end)

    end
  }
}

-- use the lua-ev loop
ev.Loop.default:loop()
