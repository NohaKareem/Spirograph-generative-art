# Spirograph Generative Art
Built for the class 5009. Built with Arduino (code requires circuit to run), node, Johnny-five and p5.js.
Gradient colors from colorhexa.com

![](demo.gif)

## Goal
To render a spirograph and use the Arduino joystick controller to interact with it, altering y location (and thus rendered shape) as well as color mode (night mode and day mode color palettes), using y and x joystick values respectively. Furthermore, x value changes would alter the stroke weight as well. 

A CircleOutline class is defined which helps encapsulate every arc's properties within an object. 

## Paper plan/pseudocode
1. Set up back-end; a socket.io server listening to joystick changes and emiting them as joystick events 
2. Define CircleOutline class 
    * has render method to render an arc per CircleOutline object
    * has setter methods for Stroke weight, color mode and y value
3. Define empty global arrays of circle outlines, and rotation angles (to save render history)
4. listen to joystick events in the front-end
5. launch draw method to render generative art, passing joystick's updated values
6. Enter draw method
    * Clear previous renders (clear())
    * repeat 25 times (only if has been applied at most twice, to limit processing extensive render histories)
        * Render base arcs (they are spaced with gaps that could be colored differently for a colorful/gradient effect)
		* Surround circle outlines with push() and pop() to ensure matrix transformations applied only to enclosed shapes
        * apply a rotation for constant movement with a variable, angle
        * push angle applied in rotation in an array to preserve rotation history 
        * push rendered circle outline into an array of CircleOutline objects, to prserve rendered history
        * increment angle 
    * render previous arcs/circle outlines
        * Iterate through all previous circle outlines, with current iterator, CircleOutline
            * iterate through all previous rotation angles
                * apply transformations and interaction updates to circle outline
                    * apply rotation from history (array of previous rotations) 
                    * update CircleOutline's stroke weight, y value and color mode based on input values
                        * for stroke weight, map joystick x value to a range of 1 to 10 (max stroke 10)
                        * for color, compare joystick x value to a threshold to determine whether day or night color palette should be applied 
                        * for y value, compare current joystick y value and increment/decrement current y value accordingly (within certain thresholds, to be included within screen)
                * Render each circle outline 
7. set a keyboard listener to listen to the key 's' to save the current frame as an image
