import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
import { Play, Pause, SkipForward, SkipBack, FastForward, Rewind, List, Clock } from 'phosphor-react-native'; // Adicionando Clock para controle de velocidade
import Slider from '@react-native-community/slider';
import './styles.css';

// Lista de tracks
const tracks = [
  {
    id: '1',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%2000%20Opening%20Credits.mp3',
    title: 'Opening Credits',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '2',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%2001%20Introduction.mp3',
    title: 'Introduction',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '3',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%201.mp3',
    title: 'Chapter 1 - All or Nothing What It Takes to Succeed',
    artist: 'DR. TIM THAYNE',
  },
  {
    id: '4',
    url: 'https://trustyy-public.s3.us-east-1.amazonaws.com/shareable/670013517e69ca0fad1632b1/Chapter%202.mp3',
    title: 'Chapter 2 - Know When to Hold `Em: How Good Treatment Programs Work',
    artist: 'DR. TIM THAYNE',
  },
];

const App = () => {
  const [trackTitle, setTrackTitle] = useState(tracks[0].title);
  const [artistName, setArtistName] = useState(tracks[0].artist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { position, duration } = useProgress();
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showQueue, setShowQueue] = useState(false); // Controle da queue de faixas

  // Função de setup inicial do player
  useEffect(() => {
    setupPlayer();
    const trackChangeListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
      if (data.nextTrack !== null) {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        setTrackTitle(track.title);
        setArtistName(track.artist);
      }
    });
    return () => {
      trackChangeListener.remove();
    };
  }, []);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(tracks);
    setTrackTitle(tracks[0].title);
    setArtistName(tracks[0].artist);
  };

  // Funções de controle de reprodução
  const playTrack = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const pauseTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const skipForward10Seconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + 10);
  };

  const skipBackward10Seconds = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, currentPosition - 10));
  };

  const handleSliderChange = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const changePlaybackSpeed = async (speed) => {
    setPlaybackSpeed(speed);
    await TrackPlayer.setRate(speed);
  };
  

  // Funções de toggle
  const toggleSpeedOptions = () => setShowSpeedOptions(!showSpeedOptions);
  const toggleQueue = () => setShowQueue(!showQueue); // Função para exibir/esconder a queue

  import React, { useEffect, useState } from 'react';
  import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
  import TrackPlayer, { useProgress, Event } from 'react-native-track-player';
  import { Play, Pause, SkipForward, SkipBack, FastForward, Rewind, List, Clock } from 'phosphor-react-native';
  import Slider from '@react-native-community/slider';
  
  const App = () => {
    const [trackTitle, setTrackTitle] = useState(tracks[0].title);
    const [artistName, setArtistName] = useState(tracks[0].artist);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const { position, duration } = useProgress();
    const [showSpeedOptions, setShowSpeedOptions] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
  
    useEffect(() => {
      setupPlayer();
      const trackChangeListener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
        if (data.nextTrack !== null) {
          const track = await TrackPlayer.getTrack(data.nextTrack);
          setTrackTitle(track.title);
          setArtistName(track.artist);
        }
      });
      return () => {
        trackChangeListener.remove();
      };
    }, []);
  
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(tracks);
      setTrackTitle(tracks[0].title);
      setArtistName(tracks[0].artist);
    };
  
    return (
      <View className="flex-1 bg-gray-900 p-4">
        {/* Ícone de Queue */}
        <TouchableOpacity onPress={toggleQueue} className="absolute top-4 left-4">
          <List size={24} color="#FFF" />
        </TouchableOpacity>
  
        {/* Ícone de Velocidade */}
        <TouchableOpacity onPress={toggleSpeedOptions} className="absolute top-4 right-4">
          <Clock size={24} color="#FFF" />
        </TouchableOpacity>
  
        {/* Capa do Audiobook */}
        <Image
          source={require('./Assets/Screenshot_Not_By_Chance2.png')}
          className="w-3/4 h-40 mt-8 self-center"
          resizeMode="contain"
        />
  
        {/* Informações da Música */}
        <View className="mt-4 items-center">
          <Text className="text-white text-xl font-semibold">{trackTitle}</Text>
          <Text className="text-gray-400">{artistName}</Text>
        </View>
  
        {/* Barra de Progresso */}
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-gray-400">{formatTime(position)}</Text>
          <Slider
            className="flex-1 mx-4"
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#55A8B2"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#FFF"
          />
          <Text className="text-gray-400">{formatTime(duration)}</Text>
        </View>
  
        {/* Controles de Reprodução */}
        <View className="flex-row items-center justify-around mt-4">
          <TouchableOpacity onPress={skipToPrevious} className="p-2">
            <SkipBack size={20} color="#4B5563" weight="fill" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipBackward10Seconds} className="p-2">
            <Rewind size={24} color="#4B5563" weight="fill" />
          </TouchableOpacity>
          <TouchableOpacity onPress={isPlaying ? pauseTrack : playTrack} className="bg-blue-500 p-4 rounded-full">
            {isPlaying ? (
              <Pause size={32} color="#FFF" weight="fill" />
            ) : (
              <Play size={32} color="#FFF" weight="fill" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward10Seconds} className="p-2">
            <FastForward size={24} color="#4B5563" weight="fill" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext} className="p-2">
            <SkipForward size={20} color="#4B5563" weight="fill" />
          </TouchableOpacity>
        </View>
  
        {/* Caixa de opções de velocidade */}
        {showSpeedOptions && (
          <View className="absolute bottom-16 right-4 bg-gray-800 p-2 rounded">
            {[0.5, 1, 1.5, 2].map((speed) => (
              <TouchableOpacity key={speed} onPress={() => changePlaybackSpeed(speed)} className="p-1">
                <Text className={`text-white ${playbackSpeed === speed ? "font-bold" : ""}`}>
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
  
        {/* Queue de faixas */}
        {showQueue && (
          <View className="absolute bottom-16 left-4 bg-gray-800 p-2 rounded w-3/4 h-40">
            <FlatList
              data={tracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => TrackPlayer.skip(index)} className="p-1">
                  <Text className="text-white">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    );
  };
  
  

// Estilos refatorados

{/* Container */}
<View className="flex-1 justify-center items-center bg-white">

{/* albumCover */}
<Image
  source={require('./Assets/Screenshot_Not_By_Chance2.png')}
  className="w-3/4 h-64 self-center mb-2"
/>

{/* infoContainer */}
<View className="items-center mb-5">
  {/* songTitle */}
  <Text className="self-stretch text-lg font-semibold mb-2 text-gray-800 text-left pl-4">
    {trackTitle}
  </Text>

  {/* artistName */}
  <Text className="self-stretch text-xs text-gray-400 text-left pl-4">
    {artistName}
  </Text>
</View>

{/* progressContainer */}
<View className="flex-row items-center justify-between w-4/5 my-5">
  {/* timeText */}
  <Text className="text-black text-xs mb-10">{formatTime(position)}</Text>
  <Slider
    style={{ width: '80%', height: 16 }}
    className="rounded-lg"
  />
  <Text className="text-black text-xs mb-10">{formatTime(duration)}</Text>
</View>

{/* controlsContainer */}
<View className="flex-row justify-around items-center absolute bottom-1 w-4/5 my-5">
  {/* controlButton */}
  <TouchableOpacity className="p-2">
    {/* playPauseButtonContainer */}
    <TouchableOpacity className="flex p-3 items-center justify-center rounded-full bg-teal-500">
      {/* playPauseIcon */}
    </TouchableOpacity>
  </TouchableOpacity>
</View>

{/* playbackSpeedButton */}
<Text className="text-lg text-white mt-2">Playback Speed</Text>

{/* speedOptionsBox */}
<View className="absolute bottom-16 left-5 right-5 p-2 bg-white rounded-lg shadow-lg">
  {/* speedText */}
  <Text className="text-lg text-teal-500 mb-2">Speed Options</Text>
  {/* selectedSpeed */}
  <Text className="text-lg font-bold text-gray-700 mb-2">Selected Speed</Text>
</View>

{/* queueButton */}
<TouchableOpacity className="absolute top-10 left-3 z-10 bg-black bg-opacity-60 p-1.5 rounded-full" />

{/* speedButton */}
<TouchableOpacity className="absolute top-10 right-3 z-10 bg-black bg-opacity-60 p-1.5 rounded-full" />

{/* queueContainer */}
<View className="absolute bottom-36 left-5 right-5 p-5 bg-white rounded-lg shadow-lg">
  {/* queueTrackTitle */}
  <Text className="text-lg text-gray-800 p-2 border-b border-gray-200">Queue Track Title</Text>
</View>

</View>

export default App;

