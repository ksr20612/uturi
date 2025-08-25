import { createListCollection } from '@chakra-ui/react';

/*
            <option value={SonificationMethod.MELODY}>음계 변화</option>
            <option value={SonificationMethod.VOLUME}>음량 변화</option>
            <option value={SonificationMethod.RHYTHM}>리듬 변화</option>
*/

export const enum SonificationMethod {
  FREQUENCY = 'frequency',
  VOLUME = 'volume',
  RHYTHM = 'rhythm',
  MELODY = 'melody',
}

export const SONIFICATION_LIST_COLLECTION = createListCollection({
  items: [
    { label: '음계 변화', value: SonificationMethod.FREQUENCY },
    { label: '음량 변화', value: SonificationMethod.VOLUME },
    { label: '리듬 변화', value: SonificationMethod.RHYTHM },
    { label: '멜로디 변화', value: SonificationMethod.MELODY },
  ],
});
