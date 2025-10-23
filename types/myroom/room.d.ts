export interface RoomEntry {
  fromUid: string;
  id?: string;
  cover?: string;
  category: string;
  date: Date;
  description: string;
  enableChat: boolean;
  locationDetail: string;
  maxMember: string;
  minMember: string;
  openPublic: boolean;
  place: string;
  planName: string;
  timeEnd: string;
  timeStart: string;
  hostName?: string;
  imageAvatar?: ImageSourcePropType;
  joinedUids?: string[];
}
