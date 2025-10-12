import CardRoom from "@/assets/component/myroom/CardRoom";
import EmptyState from "@/assets/component/myroom/EmptyState";
import ModalFilteringDynamic from "@/assets/component/myroom/ModalFiltering";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
;

type RoomCategory = "all" | "sport" | "hangout" | "learning" | "events" | "hobby";
type SectionTab = 'upcoming' | 'hosted' | 'history';

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  slotRemaining?: number;
  slotTotal?: number;
  hostName: string;
  imageSource?: any | false;
  category?: RoomCategory;
};

const roomCategories: RoomCategory[] = [
  "all",
  "sport",
  "hangout",
  "learning",
  "events",
  "hobby",
];

const Segmented = ({
  value,
  options,
  onChange,
}: {
  value: SectionTab;
  options: { key: SectionTab; label: string }[];
  onChange: (v: SectionTab) => void;
}) => {
  return (
    <View className="mt-3 items-center">
      <View className="flex-row gap-8">
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <TouchableOpacity key={opt.key} onPress={() => onChange(opt.key)}>
              <View className="items-center">
                <Text className={`text-[14px] ${active ? "text-amber-700 font-semibold" : "text-neutral-400"}`}>
                  {opt.label}
                </Text>
                <View className={`h-[2px] w-14 mt-2 rounded ${active ? "bg-amber-500" : "bg-transparent"}`} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// const SvgBySection = {
//   upcoming: Globe,
//   hosted: Hobby,
//   history: Events,
// } as const; 
  
export default function MyRoomDash({
  initialSection = "upcoming",
}: {
  initialSection?: SectionTab;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  {/* Ini buat coba empty state*/}
  const upcomingEvents: EventItem[] = [
    {
      id: 1,
      title: "Morning Run 5K",
      date: "22 Sept 2025, 18.00 - 20.00 WIB",
      location: "Gelora Bung Karno",
      slotRemaining: 5,
      slotTotal: 10,
      hostName: "Balqis",
      imageSource: false,
      category: "sport",
    },
    {
      id: 2,
      title: "Menanam Mangrove",
      date: "31 Oktober 2025, 06.00 - 10.00 WIB",
      location: "Pantai Indah Kapuk",
      slotRemaining: 3,
      slotTotal: 15,
      hostName: "Alicia",
      imageSource: false,
      category: "events",
    },
    {
      id: 3,
      title: "Sholat Jumat Bersama",
      date: "17 Oktober 2025, 11.30 - 13.00 WIB",
      location: "BINUS Syahdan",
      slotRemaining: 10,
      slotTotal: 15,
      hostName: "Akbar",
      imageSource: false,
      category: "learning",
    },
  ];

  const hostedEvents: EventItem[] = [
    // {
    //   id: 101,
    //   title: "Tech Meetup with Timothy Ronald",
    //   date: "28 Sept 2025, 13.00 - 16.00 WIB",
    //   location: "BINUS Anggrek",
    //   slotRemaining: 3,
    //   slotTotal: 20,
    //   hostName: "Bryan",
    //   imageSource: false,
    //   category: "learning",
    // },
  ];

  const historyEvents: EventItem[] = [
    // {
    //   id: 201,
    //   title: "Community Cleanup",
    //   date: "12 Aug 2025, 08.00 - 10.00 WIB",
    //   location: "Pantai Indah Kapuk",
    //   slotRemaining: 0,
    //   slotTotal: 10,
    //   hostName: "Bryan",
    //   imageSource: false,
    //   category: "events",
    // },
  ];

  const dataBySection: Record<SectionTab, EventItem[]> = {
    upcoming: upcomingEvents,
    hosted: hostedEvents,
    history: historyEvents,
  };

  const initialFromPath: SectionTab | undefined = ((): SectionTab | undefined => {
    if (pathname.endsWith("/upcoming")) return "upcoming";
    if (pathname.endsWith("/hosted")) return "hosted";
    if (pathname.endsWith("/history")) return "history";
    return undefined;
  })();

  const [section, setSection] = useState<SectionTab>(initialFromPath ?? initialSection);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChangeSection = (next: SectionTab) => {
    setSection(next);
    if (pathname.startsWith("/yourroom")) {
      router.replace(`/yourroom/${next}` as any);
    }
  };

  const visible = useMemo(() => dataBySection[section], [section]);

  return (
  <SafeAreaView
    className="bg-neutral-100"
    style={{ flex: 1, paddingTop: insets.top }}
  >
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-[16px] pt-6">
        <Text className="text-[20px] font-semibold text-neutral-800 mb-3">
          Your Room
        </Text>

        {/* Segmented tabs */}
        <Segmented
          value={section}
          onChange={setSection}
          options={[
            { key: "upcoming", label: "Upcoming" },
            { key: "hosted", label: "Hosted" },
            { key: "history", label: "History" },
          ]}
        />
      </View>

      {/* Room list */}
      {visible.length > 0 ? (
        <View className="px-[13px] pt-[15px] pb-[15px]">
          <View className="gap-4">
            {visible.map((ev) => (
              <CardRoom
                key={ev.id}
                title={ev.title}
                date={ev.date}
                location={ev.location}
                slotRemaining={ev.slotRemaining ?? 0}
                slotTotal={ev.slotTotal ?? 0}
                hostName={ev.hostName}
                imageSource={ev.imageSource}
              />
            ))}
          </View>
        </View>
      ) : (

        /*Empty state*/
        <View className="flex-1 justify-center items-center mt-8">
          <EmptyState
            variant={section}
            width={90}
            height={60}
          />
        </View>
      )}
    </ScrollView>

    {/* Filter Modal */}
    <ModalFilteringDynamic
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      filters={[
        {
          title: "Sort By",
          options: [
            "Earliest Time",
            "Nearest Location",
            "Most Popular",
            "Recently Added",
          ],
        },
        { title: "Price", options: ["Free", "Paid"] },
        { title: "Event Type", options: ["Online", "Onsite"] },
      ]}
    />
  </SafeAreaView>
);
}

