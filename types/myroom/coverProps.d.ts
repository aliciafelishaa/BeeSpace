export interface CoverProps {
  image: string | null;
  uploading: boolean;
  pickPhoto: (type: "camera" | "gallery") => Promise<void>;
}

export type FileProps = {
  uri: string;
  type?: string;
  name?: string;
};

export interface CoverPickerProps {
  label: string;
  imageUrl?: string;
  onChangeImage: (url: string) => void;
  size?: number;
  onEdit?: boolean;
}
