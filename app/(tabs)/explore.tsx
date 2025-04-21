import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Index = () => {
  const [title, setTitle] = useState('');
  const [mapel, setMapel] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('PR');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (title.trim() === '' || mapel.trim() === '') {
      Alert.alert('duh','gantengnya!');
      return;
    }

    if (title.trim().length < 3) {
      Alert.alert('huh','ishhh kamu jangan gitu');
      return;
    }

    


    const newTask = {
      id: Date.now().toString(),
      title,
      mapel,
      deadline: deadline || '-',
      category,
      selected: false,
    };

    setList([...list, newTask]);
    resetForm();
  };

  const loadTask = async () => {
    const saved = await AsyncStorage.getItem('task');
    if (saved) setList(JSON.parse(saved));
  };

  const saveTask = async () => {
    await AsyncStorage.setItem('task', JSON.stringify(list));
  };

  const deleteTask = (id: string) => {
    Alert.alert('Beneran?','aku hapus ni ya',
    [
      { text : 'batal'},
      {
        text : 'hapus', style: 'destructive',
        onPress: ()  => {
          setList(prev => prev.filter(item => item.id !== id));
          Alert.alert('dihapus', 'tugas berhasih');
        }
      }
    ]

    );
    setList(list.filter(item => item.id !== id));
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setMapel(item.mapel);
    setDeadline(item.deadline);
    setCategory(item.category);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleEdit = () => {
    const updated = list.map(item =>
      item.id === editId
        ? { ...item, title, mapel, deadline, category }
        : item
    );
    setList(updated);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setMapel('');
    setDeadline('');
    setCategory('PR');
    setIsEditing(false);
    setEditId(null);
  };

  const toggleSelectTask = (id: string) => {
    const updatedList = list.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setList(updatedList);
  };

  const TaskCard = ({ item }) => (
    <View style={tw`flex-row items-center bg-white rounded-xl p-4 mb-4 mx-5 shadow-md`}>
      {/* Centang */}
      <TouchableOpacity onPress={() => toggleSelectTask(item.id)} style={tw`mr-4`}>
        <View style={tw`w-6 h-6 rounded items-center justify-center ${item.selected ? 'bg-green-700' : 'bg-white border border-gray-400'}`}>
          {item.selected && <Text style={tw`text-white text-sm`}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Konten */}
      <View style={tw`flex-1`}>
        <Text style={tw`font-bold text-gray-800`}>{item.title}</Text>
        <Text style={tw`text-gray-500 text-xs`}>Mapel {item.mapel}</Text>
        <Text style={tw`text-red-700 font-semibold text-xs mt-1`}>{item.deadline}</Text>
      </View>

      {/* Aksi */}
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity onPress={() => startEdit(item)} style={tw`mr-2`}>
          <View style={tw`w-8 h-8 bg-blue-900 rounded items-center justify-center`}>
            <Text style={tw`text-white text-sm`}>✎</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <View style={tw`w-8 h-8 bg-red-800 rounded items-center justify-center`}>
            <Text style={tw`text-white text-sm`}>🗑️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      {/* Header */}
      <View style={tw`bg-[#2A4D50] p-5 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-white text-xl `}>My List</Text>
            <Text style={tw`text-white text-sm font-bold mt-3`}>Hello Fanady👋</Text>
          </View>
        </View>

        {/* Tab selector */}
        <View style={tw`flex-row bg-white mt-5 rounded-xl overflow-hidden mt-10`}>
          <TouchableOpacity style={tw`flex-1 p-3 bg-[#DDF4E4]`}>
            <Text style={tw`text-center font-bold text-green-800`}>My Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`flex-1 p-3`}>
            <Text style={tw`text-center text-gray-500`}>In-progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`flex-1 p-3`}>
            <Text style={tw`text-center text-gray-500`}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Input */}
      <View style={tw`px-5 mt-6`}>
        <TextInput
          placeholder="Mata pelajaran"
          value={mapel}
          onChangeText={setMapel}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white text-gray-500`}
        />
        <TextInput
          placeholder="Judul tugas"
          value={title}
          onChangeText={setTitle}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white text-gray-500`}
        />
        <TextInput
          placeholder="Deadline (YYYY-MM-DD)"
          value={deadline}
          onChangeText={setDeadline}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white text-gray-500`}
        />
        <View>
          <Picker
            selectedValue={category}
            onValueChange={value => setCategory(value)}
            style={tw`border border-[#2A4D50] rounded-full mb-3 h-12 px-4 text-gray-500`}
          >
            <Picker.Item label="PR" value="PR" />
            <Picker.Item label="Mapel" value="Mapel" />
            <Picker.Item label="Tugas" value="Tugas" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={isEditing ? handleEdit : addTask}
          style={tw`bg-[#2A4D50] py-3 rounded-xl`}
        >
          <Text style={tw`text-center text-white font-bold`}>
            {isEditing ? 'Update' : 'Tambah Tugas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List Tugas */}
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard item={item} />}
        contentContainerStyle={tw`pt-5 pb-10`}
        ListEmptyComponent={() => (
          <View style={tw`items-center justify-center mt-20`}>
            <Text style={tw`text-gray-500 text-lg font-semibold`}>Asikk gaada tugas 😎</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Index;
