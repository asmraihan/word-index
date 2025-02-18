import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { eq } from "drizzle-orm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormCheckbox,
  FormCombobox,
  FormField,
  FormInput,
  FormRadioGroup,
  FormSelect,
  FormElement,
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
import { useDatabase } from "@/db/provider";
import { wordTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import type { word } from "@/lib/storage";

const WordCategories = [
  { value: "general", label: "General" },
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adjectives", label: "Adjectives" },
];


const formSchema = createInsertSchema(wordTable, {
  word: (schema) =>
    schema.word.min(1, {
      message: "Please enter a word name.",
    }),
  translation: (schema) =>
    schema.translation.min(1, {
      message: "We need to know.",
    }),
  sentence: (schema) =>
    schema.sentence.min(1, {
      message: "We need to know.",
    }),
  category: z.object(
    { value: z.string(), label: z.string() },
    {
      invalid_type_error: "Please select category",
    },
  ),
});

// TODO: refactor to use UI components

export default function FormScreen() {
  const { db } = useDatabase();
  const router = useRouter();
  const scrollRef = React.useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [word, setword] = React.useState<word>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);
  useFocusEffect(
    React.useCallback(() => {
      fetchwordById();
    }, []),
  );
  const defaultValues = React.useMemo(() => {
    if (word) {
      return {
        word: word.word,
        translation: word.translation,
        sentence: word.sentence,
        category: WordCategories.find((cat) => cat.value === word.category),
      }
    }
    return {
      word: "",
      translation: "",
      sentence: "",
      category: {
        value: "", label: "",
      },
    }
  }, [word])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    values: defaultValues
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const fetchwordById = async () => {
    const fetchedword = await db
      ?.select()
      .from(wordTable)
      .where(eq(wordTable.id, id as string))
      .execute();
    if (fetchedword) {
      setword(fetchedword[0])
    }
  };
  const handleDeleteword = async () => {
    // Are you sure you want to delete this word ?
    try {
      await db?.delete(wordTable).where(eq(wordTable.id, id)).execute();
      router.replace("/")
    } catch (error) {
      console.error("error", error)
    }

  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await db?.update(wordTable).set({
        word: values.word,
        translation: values.translation,
        sentence: values.sentence,
        category: values.category.value,
      }).where(eq(wordTable.id, id as string))
        .execute();

      router.replace("/");
    } catch (error) {
      console.error("error", error)
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
          title: "word",
        }}
      />
      <FormElement
        onSubmit={handleSubmit} >

        <Form {...form}>
          <View className="gap-7">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormInput
                  label="word"
                  className="text-foreground"

                  placeholder="word name"
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
                  label="translation"
                  className="text-foreground"

                  placeholder="translation name"
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
                  label="translation"

                  placeholder="translation for ..."
                  description="translation translation"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                return (
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
                )
              }}
            />


            <Button disabled={!form.formState.isDirty} onPress={form.handleSubmit(handleSubmit)}>
              <Text>Update</Text>
            </Button>


          </View>
        </Form>
      </FormElement>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button

            variant="destructive"
            className="shadow shadow-foreground/5 my-4"
          >
            <Text>Delete</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this word ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onPress={handleDeleteword}>
              <Text>Continue</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollView>
  );
}
