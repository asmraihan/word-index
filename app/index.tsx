import { useScrollToTop } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { eq } from "drizzle-orm";
import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { wordTable } from "@/db/schema";
import { Plus, PlusCircle } from "@/components/Icons";
import { useMigrationHelper } from "@/db/drizzle";
import { useDatabase } from "@/db/provider";
import { SettingsIcon } from "lucide-react-native";
import { WordCard } from "@/components/word";
import type { word } from "@/lib/storage";

export default function Screen() {
  const { success, error } = useMigrationHelper();

  if (error) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return <ScreenContent />;
}

function ScreenContent() {
  const { db } = useDatabase();
  const { data: words, error } = useLiveQuery(db?.select().from(wordTable));

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const router = useRouter();

  const renderItem = React.useCallback(
    ({ item }: { item: word }) => <WordCard {...item} />,
    [],
  );

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary/30">
        <Text className="text-destructive pb-2 ">Error Loading data</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 gap-5 p-6 bg-secondary/30">

      <Stack.Screen
        options={{
          title: "Word Index",
          headerRight: () => <ThemeToggle />,
          headerLeft: () => (
            <Button variant="link" onPress={() => router.navigate("settings")}>
              <SettingsIcon />
            </Button>
          ),
        }}
      />
      <FlashList
        ref={ref}
        className="native:overflow-hidden rounded-t-lg"
        estimatedItemSize={49}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View>
            <Text className="text-lg">Hi There 👋</Text>
            <Text className="text-sm">
              This example use sql.js on Web and expo/sqlite on native
            </Text>
            <Text className="text-sm">
              If you change the schema, you need to run{" "}
              <Text className="text-sm font-mono text-muted-foreground bg-muted">
                bun migrate
              </Text>
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="p-2" />}
        data={words}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListFooterComponent={<View className="py-4" />}
      />
      <View className="absolute bottom-10 right-8">
        <Link href="/create" asChild>
          <Pressable>
            <View className="bg-primary justify-center rounded-full h-[45px] w-[45px]">
              <Plus className="text-background self-center" />
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
