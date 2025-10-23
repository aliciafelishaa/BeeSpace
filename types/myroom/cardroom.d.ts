export type CardRoomProps = {
  id?: string;
  title: string;
  date: Date;
  location: string;
  slotRemaining: string;
  slotTotal: string;
  hostName?: string;
  imageSource?: ImageSourcePropType;
  imageAvatar?: ImageSourcePropType;
  isEdit: boolean;
  timeEnd: string;
  timeStart: string;
};
