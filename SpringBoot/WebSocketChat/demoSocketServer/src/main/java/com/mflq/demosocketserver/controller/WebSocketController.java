package com.mflq.demosocketserver.controller;

import com.mflq.demosocketserver.model.InputMessage;
import com.mflq.demosocketserver.model.OutputMessage;
import com.mflq.demosocketserver.model.WritingNotify;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;

/*Clase controladora para manejar las conexiones de websocket y enviar y recibir mensajes */
@Log4j2
@Controller
public class WebSocketController {

    //Clase para enviar y recibir mensajes a traves del protocolo STOMP
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    /*MessagesMapping para indicar donde los clientes van a enviar los mensajes,(Es decir este es el endpoin para hacer una peticion) */
    @MessageMapping("/hello")
    /**La anotación @Header permite el acceso a los encabezados expuestos por el mensaje entrante. Por ejemplo, podemos
     * capturar el ID de sesión actual sin necesidad de interceptores complicados. Del mismo modo, podemos acceder al usuario
     * actual a través de Principal.*/
    public void sendSpecific(@Payload InputMessage inputMessage) {
        log.info("Send Message from: {} to user: {}", inputMessage.getFrom(), inputMessage.getTo());

        /*El mensaje de salida es el mismo de entrada, pero agrega un date(Fecha)*/
        OutputMessage outputMessage = new OutputMessage();
        outputMessage.setFrom(inputMessage.getFrom());
        outputMessage.setTo(inputMessage.getTo());
        outputMessage.setText(inputMessage.getText());
        outputMessage.setTime(new SimpleDateFormat("HH:mm").format(new Date()));

        /*con convertAndSendToUser enviamos el mensaje, convertAndSendToUser(idUserDestino,
        ruta_por_la_cual_se_envia_mensages_del_servidor_al_usuario, mensaje_de_salida) */
        simpMessagingTemplate.convertAndSendToUser(inputMessage.getTo(), "/queue/messages", outputMessage);

    }


    @MessageMapping("/notify")
    public void notifyWrite(@Payload WritingNotify writingNotify) {
        log.info("notify to {}", writingNotify.getTo());

        /*Notificamos al usuario de destino que le están escribiendo*/
        simpMessagingTemplate.convertAndSendToUser(writingNotify.getTo(), "/queue/notify", "" + writingNotify.getFrom() + " esta escribiendo ...");

    }
}
