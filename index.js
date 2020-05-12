import uuidV1 from 'uuid/v1';
import uuidV3 from 'uuid/v3';
import uuidV4 from 'uuid/v4';
import uuidV5 from 'uuid/v5';
import { useState } from 'react';

const idGenerators = {
    v1: uuidV1,
    v3: uuidV3,
    v4: uuidV4,
    v5: uuidV5
};

function useId(version='v4', ...uuidArgs) {
    if( !(version in idGenerators) ) {
        throw new Error('Invalid version for id generator');
    }

    // Utilize useState instead of useMemo because React
    // makes no guarantees that the memo store is durable
    let [id] = useState(() => {
        return idGenerators[version](...uuidArgs);
    });

    return id;
}

export default useId;
