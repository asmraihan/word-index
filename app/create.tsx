import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { Link, Stack, useRouter } from "expo-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormCheckbox,
  FormCombobox,
  FormElement,
  FormField,
  FormInput,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Text } from "@/components/ui/text";
import { wordTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useDatabase } from "@/db/provider";
import { X } from "lucide-react-native";


const WordCategories = [
  { value: "general", label: "General" },
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adjectives", label: "Adjectives" },
];


const formSchema = createInsertSchema(wordTable, {
  word: (schema) => schema.word.min(1, {
    message: "Please enter a word name.",
  }),
  translation: (schema) => schema.translation.min(1, {
    message: "We need to know.",
  }),
  sentence: (schema) => schema.sentence.min(1, {
    message: "We need to know.",
  }),
  category: z.object(
    { value: z.string(), label: z.string() },
    {
      invalid_type_error: "Please select a favorite email.",
    },
  ),
});


// TODO: refactor to use UI components

export default function FormScreen() {
  const { db } = useDatabase();
  const router = useRouter();

  const scrollRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
      translation: "",
      sentence: "",
      category: { value: "general", label: "General" },
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {

    try {
      await db?.insert(wordTable).values({
        ...values,
        category: values.category.value,
      }).returning()
      router.replace("/")
    } catch (e) {
      console.error(e)
    }

  }
  return (
    <ScrollView
      ref={scrollRef}
      contentContainerClassName="p-6 mx-auto w-full max-w-xl"
      showsVerticalScrollIndicator={false}
      automaticallyAdjustContentInsets={false}
      contentInset={{ top: 12 }}
    >
      <Stack.Screen
        options={{
          title: "New word",
          headerRight: () => Platform.OS !== "web" && <Pressable onPress={() => router.dismiss()}><X /></Pressable>
        }}
      />

      <Form {...form}>
        <View className="gap-8">
          <FormField
            control={form.control}
            name="word"
            render={({ field }) => (
              <FormInput
                label="Word"
                placeholder="Write the word"
                className="text-foreground"
                description="This will help you remind."
                autoCapitalize="none"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="translation"
            render={({ field }) => (
              <FormInput
                label="Translation"
                placeholder="Write the translation"
                className="text-foreground"
                description="This will help you remind."
                autoCapitalize="none"
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="sentence"
            render={({ field }) => (
              <FormTextarea
                label="sentence"
                placeholder="Sentence for ..."
                description="sentence for ..."
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormSelect
                label="Category"
                description="Select on of the word description"
                {...field}
              >
                <SelectTrigger
                  onLayout={(ev) => {
                    setSelectTriggerWidth(ev.nativeEvent.layout.width);
                  }}
                >
                  <SelectValue
                    className={cn(
                      "text-sm native:text-lg",
                      field.value ? "text-foreground" : "text-muted-foreground",
                    )}
                    placeholder="Select a word category"
                  />
                </SelectTrigger>
                <SelectContent
                  insets={contentInsets}
                  style={{ width: selectTriggerWidth }}
                >
                  <SelectGroup>
                    {WordCategories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        label={cat.label}
                        value={cat.value}
                      >
                        <Text>{cat.label}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </FormSelect>
            )}
          />


          <Button onPress={form.handleSubmit(handleSubmit)}>
            <Text>Submit</Text>
          </Button>
          <View>
            <Button
              variant="ghost"
              onPress={() => {
                form.reset();
              }}
            >
              <Text>Clear</Text>
            </Button>
          </View>


        </View>
      </Form>

    </ScrollView >
  );
}
