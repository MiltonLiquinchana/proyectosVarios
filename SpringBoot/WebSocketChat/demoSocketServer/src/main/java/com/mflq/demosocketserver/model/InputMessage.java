package com.mflq.demosocketserver.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class InputMessage {

    private String from;
    private String to;
    private String text;
}
