package com.mflq.demosocketserver.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/*Clase de configuracion para habilitar el soporte de websockets y stop en mi aplicacion*/
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /*
         * Esta ruta es importante porque se va a utilizar para conectarnos desde el
         * cliente al servidor de websocket
         */
        registry.addEndpoint("/ws")
                /* Con esto decimos que se va a poder acceder desde cualquier aplicacion */
                .setAllowedOriginPatterns("*");
        /*
         * Permite utilizar el protocolo http para conectarnos al servidor websocket,
         * caso contrario se tendria que conectar con wss
         */
        //podemos agregar withSockJS para activar sockjs

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /*También prefijamos todas nuestras colas y destinos de usuarios con "/secured" para que requieran autenticación.
        Para puntos finales desprotegidos, podemos eliminar el
        prefijo "/seguro" (como resultado de nuestras otras configuraciones de seguridad).*/

        //queue reservadas para usuarios específicos y sus sesiones actuales
        //Habilita el simple broker,"/secured/user/queue/specific-user", este prefijo es para los nombres de
        //eventos, por ejemplo cuando el servidor emite un mensaje al cliente(Esta es la ruta por la cual el servidor envia mensajes al cliente)
        registry.enableSimpleBroker("/user");

        //Este es el prefijo por el cual el cliente enviara un mensaje al servidor
        registry.setApplicationDestinationPrefixes("/app");

        //Aqui le indicamos puntos finales están reservados para usuarios únicos, digamos en enableSimpleBroker, definimos dosn puntos finales:
        //quest, user, aqui tenemos que decirle cual de los puntos finales se va a utilizar para comunicaciones de un usuario a otro
        registry.setUserDestinationPrefix("/user");
    }

}
