import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, File, X, Image as ImageIcon } from 'lucide-react-native';

export default function FileInput() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        setFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-2xl font-bold text-foreground mb-2">
          File Upload
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          Upload files with shadcn styling
        </Text>

        {/* Primary Button */}
        <TouchableOpacity
          onPress={pickDocument}
          className="flex-row items-center justify-center px-4 py-3 rounded-lg bg-primary mb-4"
          activeOpacity={0.8}
        >
          <Upload size={20} className="text-primary-foreground" />
          <Text className="ml-2 font-semibold text-primary-foreground">
            Choose Files
          </Text>
        </TouchableOpacity>

        {/* Outline Variant */}
        <TouchableOpacity
          onPress={pickDocument}
          className="flex-row items-center justify-center px-4 py-3 rounded-lg border border-input bg-background mb-4"
          activeOpacity={0.8}
        >
          <Upload size={20} className="text-foreground" />
          <Text className="ml-2 font-semibold text-foreground">
            Choose Files (Outline)
          </Text>
        </TouchableOpacity>

        {/* Dropzone Style */}
        <TouchableOpacity
          onPress={pickDocument}
          className="items-center justify-center p-8 rounded-lg border-2 border-dashed border-border bg-muted mb-6"
          activeOpacity={0.8}
        >
          <View className="items-center">
            <View className="w-12 h-12 rounded-full items-center justify-center bg-secondary mb-3">
              <Upload size={24} className="text-muted-foreground" />
            </View>
            <Text className="font-semibold text-foreground mb-1">
              Click to upload
            </Text>
            <Text className="text-xs text-muted-foreground">
              Tap to select files
            </Text>
          </View>
        </TouchableOpacity>

        {/* Selected Files List */}
        {files.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Selected Files ({files.length})
            </Text>
            {files.map((file, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between p-3 rounded-lg border border-border bg-secondary mb-2"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded items-center justify-center bg-muted mr-3">
                    {file.mimeType?.startsWith('image/') ? (
                      <ImageIcon size={20} className="text-muted-foreground" />
                    ) : (
                      <File size={20} className="text-muted-foreground" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-sm font-medium text-foreground mb-1"
                      numberOfLines={1}
                    >
                      {file.name}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeFile(index)}
                  className="ml-2 p-2"
                  activeOpacity={0.6}
                >
                  <X size={18} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Secondary Compact Button */}
        <TouchableOpacity
          onPress={pickDocument}
          className="flex-row items-center justify-center px-3 py-2 rounded-md bg-secondary"
          activeOpacity={0.8}
        >
          <File size={16} className="text-secondary-foreground" />
          <Text className="ml-2 text-sm font-medium text-secondary-foreground">
            Add More Files
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
