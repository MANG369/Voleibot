const RULES_DATA = [
    {
        category: "Conceptos Básicos",
        title: "Rotación",
        content: "Cuando el equipo receptor gana el derecho al saque, sus jugadores deben rotar una posición en el sentido de las agujas del reloj. El jugador de la posición 2 se mueve a la 1, el de la 1 a la 6, etc. Una falta de rotación resulta en un punto para el oponente."
    },
    {
        category: "Faltas Comunes",
        title: "Doble Toque",
        content: "Un jugador no puede tocar el balón dos veces consecutivas, excepto durante o después de un bloqueo. El primer toque del equipo sí puede ser un contacto múltiple y consecutivo si ocurre en una sola acción."
    },
    {
        category: "Faltas Comunes",
        title: "Cuatro Toques",
        content: "Cada equipo tiene un máximo de tres toques para devolver el balón al campo contrario. El bloqueo no cuenta como uno de estos toques."
    },
    {
        category: "Faltas Comunes",
        title: "Toque de Red",
        content: "Tocar la banda superior de la red durante la acción de jugar el balón es una falta. El contacto con la red fuera de esta acción no es necesariamente una falta, a menos que interfiera con el juego."
    },
    {
        category: "El Líbero",
        title: "Reglas del Líbero",
        content: "El Líbero es un especialista en defensa. Puede reemplazar a cualquier jugador zaguero sin notificación al árbitro. No puede sacar, bloquear, intentar un bloqueo, ni completar un ataque si el balón está por encima de la red. Si realiza un pase de dedos en la zona de frente, el siguiente ataque no puede ser completado por encima de la red."
    }
];

const SIGNALS_DATA = [
    // NOTA: Debes crear estas imágenes y guardarlas en la carpeta /reglas/signals/
    { title: "Autorización de Saque", imageUrl: "./signals/auth_serve.svg" },
    { title: "Balón Dentro", imageUrl: "./signals/ball_in.svg" },
    { title: "Balón Fuera", imageUrl: "./signals/ball_out.svg" },
    { title: "Doble Toque", imageUrl: "./signals/double_touch.svg" },
    { title: "Cuatro Toques", imageUrl: "./signals/four_touches.svg" },
    { title: "Fin de Set o Partido", imageUrl: "./signals/end_of_match.svg" }
];