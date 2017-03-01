// Globals:

var deltas = [null, null, null, null, null, null, null, null, null],
    timer  = null,
    lock   = 0,
    seen   = 0;

// Search for an inertial peak (which represents a trackpade mouse wheel gesture):

function hasPeak() {
    
    // Decrement the lock.
    
    if (lock > 0) {
        lock--;
        return false;
    }
    
    // If the oldest delta is null, there can't be a peak yet; so return.
    
    if (deltas[0] === null) return false;
    
    // Otherwise, check for a peak signature where the middle delta (4)
    // is the highest among all other deltas to the left or right.
    
    if (
        deltas[0] <  deltas[4] &&
        deltas[1] <= deltas[4] &&
        deltas[2] <= deltas[4] &&
        deltas[3] <= deltas[4] &&
        deltas[5] <= deltas[4] &&
        deltas[6] <= deltas[4] &&
        deltas[7] <= deltas[4] &&
        deltas[8] <  deltas[4]
    ) return true;
    
    // If no peak is found, return false.
    
    return false;
}

// Handle mouse wheel events:

$(window).on('mousewheel DOMMouseScroll', function(e) {
    
    // Convert the delta into a usable number (pretty standard).
    
    var delta  = e.type == 'mousewheel' ? e.originalEvent.wheelDelta * -1 : 40 * e.originalEvent.detail;
    
    // Check for an inertial peak. And if found, lock the peak
    // checking for 10 more events (decremented in hasPeak on
    // each new event) to prevent the sample window from registering
    // true more than once for each peak.
    
    if (hasPeak()) {
        lock = 10;
        seen++;
        $('div').text('Inertial Gesture Found! (' + seen + ' total)');
    }
    
    // Otherwise, check for normal mouse wheel events by assuming
    // past and present deltas would be 120 exactly, and skip nulls.
    
    else if ((deltas[8] == null || deltas[8] == 120) && Math.abs(delta) == 120)
        $('div').text('Mouse Wheel Event Found!');

    // Shift the deltas backward and add the newest (maintaining the sample window).
    
    deltas.shift();
    deltas.push(Math.abs(delta));
    
    // Clear the notification (demonstration purposes, only).
    
    clearTimeout(timer);
    timer = setTimeout(function() {
        $('div').text('Waiting ...');
    }, 200);
});
